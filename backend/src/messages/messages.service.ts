import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Chat } from './entities/chat.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
    private usersService: UsersService,
  ) {}

  async create(senderId: string, createMessageDto: CreateMessageDto) {
    const sender = await this.usersService.findOne(senderId);
    const receiver = await this.usersService.findOne(
      createMessageDto.receiverId,
    );

    if (!receiver) {
      throw new NotFoundException(
        `User with ID ${createMessageDto.receiverId} not found`,
      );
    }

    if (senderId === createMessageDto.receiverId) {
      throw new Error('Cannot send message to yourself');
    }

    // Create message
    const message = this.messagesRepository.create({
      content: createMessageDto.content,
      sender,
      senderId,
      receiver,
      receiverId: createMessageDto.receiverId,
    });

    // Save message
    const savedMessage = await this.messagesRepository.save(message);

    // Update or create chat
    await this.updateOrCreateChat(
      senderId,
      createMessageDto.receiverId,
      createMessageDto.content,
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
      chat.unreadCount = user1Id === smallerId ? chat.unreadCount + 1 : 0;
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
    // Mark all messages from otherUser to user as read
    await this.messagesRepository.update(
      { senderId: otherUserId, receiverId: userId, isRead: false },
      { isRead: true },
    );

    // Reset unread count in chat
    const [smallerId, largerId] =
      userId < otherUserId ? [userId, otherUserId] : [otherUserId, userId];

    await this.chatsRepository.update(
      { user1Id: smallerId, user2Id: largerId },
      { unreadCount: 0 },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    const result = await this.messagesRepository.count({
      where: { receiverId: userId, isRead: false },
    });
    return result;
  }

  // ____ IDK if i should leave methods below

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: string) {
    return `This action returns a #${id} message`;
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: string) {
    return `This action removes a #${id} message`;
  }
}
