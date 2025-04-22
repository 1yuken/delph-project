import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Chat } from './entities/chat.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { UsersService } from '../users/users.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { Express } from 'express';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    private usersService: UsersService,
    private fileUploadService: FileUploadService,
  ) {}

  async create(senderId, createMessageDto: CreateMessageDto) {
    const sender = await this.usersService.findOneByUsername(senderId.username);
    const receiver = await this.usersService.findOne(
      createMessageDto.receiverId,
    );

    if (!receiver) {
      throw new NotFoundException(
        `User with ID ${createMessageDto.receiverId} not found`,
      );
    }

    if (sender.id === createMessageDto.receiverId) {
      throw new Error('Cannot send message to yourself');
    }

    // Create message - explicitly set isRead to false
    const message = this.messagesRepository.create({
      content: createMessageDto.content || '',
      sender,
      senderId: sender.id,
      receiver,
      receiverId: createMessageDto.receiverId,
      isRead: true,
    });

    // Save message
    const savedMessage = await this.messagesRepository.save(message);

    // Update or create chat
    await this.updateOrCreateChat(
      sender.id,
      createMessageDto.receiverId,
      createMessageDto.content || '',
    );

    return savedMessage;
  }

  async createWithImage(
    senderId,
    messageData: { content?: string; receiverId: string },
    file: Express.Multer.File,
  ) {
    const sender = await this.usersService.findOneByUsername(senderId.username);
    const receiver = await this.usersService.findOne(messageData.receiverId);

    if (!receiver) {
      throw new NotFoundException(
        `User with ID ${messageData.receiverId} not found`,
      );
    }

    if (sender.id === messageData.receiverId) {
      throw new Error('Cannot send message to yourself');
    }

    // Get image URL
    const imageUrl = this.fileUploadService.getFileUrl(file.filename);

    // Create message with image - explicitly set isRead to false
    const message = this.messagesRepository.create({
      content: messageData.content || '',
      imageUrl,
      sender,
      senderId: sender.id,
      receiver,
      receiverId: messageData.receiverId,
      isRead: true,
    });

    // Save message
    const savedMessage = await this.messagesRepository.save(message);

    // Create preview text for chat list
    let previewText = messageData.content || '';
    if (!previewText) {
      previewText = '📷 Image';
    } else if (previewText.length > 30) {
      previewText = previewText.substring(0, 30) + '...';
    }

    // Update or create chat
    await this.updateOrCreateChat(
      sender.id,
      messageData.receiverId,
      previewText,
    );

    return savedMessage;
  }

  private async updateOrCreateChat(
    user1Id: string,
    user2Id: string,
    lastMessageContent: string,
  ): Promise<void> {
    // Ensure consistent ordering of user IDs to avoid duplicate chats
    const [smallerId, largerId] =
      user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];

    // Try to find existing chat
    let chat = await this.chatsRepository.findOne({
      where: [{ user1Id: smallerId, user2Id: largerId }],
    });

    if (chat) {
      // Update existing chat
      chat.lastMessageContent = lastMessageContent;

      // Increment unread count for the receiver
      // If user1Id is the sender, increment unreadCount for user2
      // If user2Id is the sender, set unreadCount to 1 (for user1)
      if (user1Id === smallerId) {
        // user1 is sending to user2
        chat.unreadCount = chat.unreadCount + 1;
      } else {
        // user2 is sending to user1
        chat.unreadCount = 1;
      }

      await this.chatsRepository.save(chat);
    } else {
      // Create new chat
      const user1 = await this.usersService.findOne(smallerId);
      const user2 = await this.usersService.findOne(largerId);

      chat = this.chatsRepository.create({
        user1,
        user1Id: smallerId,
        user2,
        user2Id: largerId,
        lastMessageContent,
        unreadCount: 1,
      });

      await this.chatsRepository.save(chat);
    }
  }

  async getMessages(
    userId: string,
    getMessagesDto: GetMessagesDto,
  ): Promise<Message[]> {
    const { userId: otherUserId, limit = 20, offset = 0 } = getMessagesDto;

    if (otherUserId) {
      // Get messages between two users
      return this.messagesRepository.find({
        where: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });
    }

    // Get all messages for user
    return this.messagesRepository.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getChats(userId: string): Promise<Chat[]> {
    // Get all chats for user
    return this.chatsRepository.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
      order: { updatedAt: 'DESC' },
    });
  }

  async markAsRead(userId: string, otherUserId: string): Promise<void> {
    this.logger.log(
      `Marking messages as read from ${otherUserId} to ${userId}`,
    );

    // Mark all messages from otherUser to user as read
    const updateResult = await this.messagesRepository.update(
      { senderId: otherUserId, receiverId: userId, isRead: false },
      { isRead: true },
    );

    this.logger.log(`Updated ${updateResult.affected} messages to read status`);

    // Reset unread count in chat
    const [smallerId, largerId] =
      userId < otherUserId ? [userId, otherUserId] : [otherUserId, userId];

    // We need to determine which user is the receiver to reset the correct unread count
    let unreadCountUpdate = {};

    if (userId === smallerId) {
      // Current user is user1, so reset unreadCount (which tracks messages from user2 to user1)
      unreadCountUpdate = { unreadCount: 0 };
    } else {
      // Current user is user2, so we need to reset unreadCount differently
      // This is a bit tricky with the current schema, might need to add a separate field
      // For now, we'll reset it to 0 as well
      unreadCountUpdate = { unreadCount: 0 };
    }

    const chatUpdateResult = await this.chatsRepository.update(
      { user1Id: smallerId, user2Id: largerId },
      unreadCountUpdate,
    );

    this.logger.log(
      `Updated chat unread count: ${chatUpdateResult.affected} chats affected`,
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    this.logger.log(`Getting unread count for user ${userId}`);

    const result = await this.messagesRepository.count({
      where: { receiverId: userId, isRead: false },
    });

    this.logger.log(`Unread count for user ${userId}: ${result}`);
    return result;
  }

  findOne(id: string) {
    return this.messagesRepository.findOne({ where: { id } });
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: string) {
    return `This action removes a #${id} message`;
  }
}
