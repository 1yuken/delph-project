import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Message } from './entities/message.entity';
import { Chat } from './entities/chat.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { UsersService } from '../users/users.service';
import { FileUploadService } from '../file-upload/file-upload.service';

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

  async create(user: any, createMessageDto: CreateMessageDto) {
    try {
      this.logger.debug('Creating message with data:', {
        user,
        createMessageDto,
      });

      const { content, receiverId } = createMessageDto;
      const senderId = user.userId;

      if (!senderId || !receiverId) {
        this.logger.error('Missing required fields:', { senderId, receiverId });
        throw new Error('Missing required fields: senderId or receiverId');
      }

      // Get sender and receiver details first
      const sender = await this.usersService.findOne(senderId);
      const receiver = await this.usersService.findOne(receiverId);

      if (!sender || !receiver) {
        this.logger.error('User not found:', { senderId, receiverId });
        throw new Error('User not found');
      }

      // Create the message
      const message = await this.messagesRepository.save({
        content,
        senderId,
        receiverId,
        isRead: false,
      });

      this.logger.debug('Message saved:', message);

      // Update or create chat
      const [smallerId, largerId] =
        senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];

      const chat = await this.chatsRepository.findOne({
        where: { user1Id: smallerId, user2Id: largerId },
      });

      if (chat) {
        this.logger.debug('Updating existing chat:', chat.id);
        // Update chat with new message
        chat.lastMessageContent = content;
        // Инкрементировать unreadCount для любого получателя
        if (receiverId === chat.user1Id || receiverId === chat.user2Id) {
          chat.unreadCount += 1;
        }
        await this.chatsRepository.save(chat);
      } else {
        this.logger.debug('Creating new chat');
        await this.chatsRepository.save({
          user1Id: smallerId,
          user2Id: largerId,
          lastMessageContent: content,
          unreadCount: 1,
        });
      }

      // Return complete message object with all required fields
      const response = {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        receiverId: message.receiverId,
        isRead: message.isRead,
        createdAt: message.createdAt,
        sender: {
          id: sender.id,
          username: sender.username,
          avatarUrl: sender.avatarUrl || null,
        },
        receiver: {
          id: receiver.id,
          username: receiver.username,
          avatarUrl: receiver.avatarUrl || null,
        },
      };

      this.logger.debug('Returning response:', response);
      return response;
    } catch (error) {
      this.logger.error(
        `Error creating message: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async createWithImage(
    senderId,
    messageData: { content?: string; receiverId: string },
    file: Express.Multer.File,
  ) {
    const sender = await this.usersService.findOneByUsername(senderId.username);
    const receiver = await this.usersService.findOne(messageData.receiverId);

    if (!receiver || !receiver.isActive) {
      throw new NotFoundException(
        `User with ID ${messageData.receiverId} not found`,
      );
    }

    if (senderId.userId === Number.parseInt(messageData.receiverId)) {
      throw new ForbiddenException('Cannot send message to yourself');
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
      where: { user1Id: smallerId, user2Id: largerId },
    });

    if (chat) {
      // Update existing chat
      chat.lastMessageContent = lastMessageContent;
      // Only increment unread count if the receiver is user1
      if (chat.user1Id === user2Id) {
        chat.unreadCount += 1;
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
    // Получаем все чаты пользователя
    const chats = await this.chatsRepository.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
      order: { updatedAt: 'DESC' },
    });

    for (const chat of chats) {
      // Определяем ID собеседника
      const companionId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
      // Находим последнее сообщение пользователя в этом чате
      const lastMyMessage = await this.messagesRepository.findOne({
        where: [{ senderId: userId, receiverId: companionId }],
        order: { createdAt: 'DESC' },
      });
      let afterDate = lastMyMessage ? lastMyMessage.createdAt : new Date(0);
      // Считаем количество сообщений собеседника после последнего сообщения пользователя
      const unreadCount = await this.messagesRepository.count({
        where: {
          senderId: companionId,
          receiverId: userId,
          createdAt: MoreThan(afterDate),
          isRead: false,
        },
      });
      chat.unreadCount = unreadCount;
    }
    return chats;
  }

  async markAsRead(userId: string, otherUserId: string): Promise<void> {
    this.logger.log(
      `Marking messages as read from ${otherUserId} to ${userId}`,
    );

    // Mark all messages from otherUser to user as read
    await this.messagesRepository.update(
      { senderId: otherUserId, receiverId: userId, isRead: false },
      { isRead: true },
    );

    // Найти чат между userId и otherUserId
    const [smallerId, largerId] =
      userId < otherUserId ? [userId, otherUserId] : [otherUserId, userId];

    const chat = await this.chatsRepository.findOne({
      where: { user1Id: smallerId, user2Id: largerId },
    });

    if (!chat) return;

    // Сбросить unreadCount только если userId — это receiverId (тот, кто читает сообщения)
    if (userId === chat.user1Id || userId === chat.user2Id) {
      chat.unreadCount = 0;
      await this.chatsRepository.save(chat);
    }
  }

  async getUnreadCount(userId: string, otherUserId?: string): Promise<number> {
    this.logger.log(
      `Getting unread count for user ${userId}${otherUserId ? ` from user ${otherUserId}` : ''}`,
    );

    const whereCondition = otherUserId
      ? { receiverId: userId, senderId: otherUserId, isRead: false }
      : { receiverId: userId, isRead: false };

    const result = await this.messagesRepository.count({
      where: whereCondition,
    });

    this.logger.log(`Unread count for user ${userId}: ${result}`);
    return result;
  }

  findOne(id: string) {
    return this.messagesRepository.findOne({ where: { id } });
  }

  async update(id: string, updateMessageDto: UpdateMessageDto, userId: string) {
    // Находим сообщение
    const message = await this.messagesRepository.findOne({ where: { id } });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Проверяем, что пользователь является отправителем сообщения
    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only update your own messages');
    }

    // Обновляем только контент сообщения
    if (updateMessageDto.content !== undefined) {
      message.content = updateMessageDto.content;
    }

    // Сохраняем обновленное сообщение
    const updatedMessage = await this.messagesRepository.save(message);

    // Если сообщение является последним в чате, обновляем превью чата
    const [smallerId, largerId] =
      message.senderId < message.receiverId
        ? [message.senderId, message.receiverId]
        : [message.receiverId, message.senderId];

    const chat = await this.chatsRepository.findOne({
      where: { user1Id: smallerId, user2Id: largerId },
    });

    if (chat && chat.lastMessageContent) {
      // Проверяем, является ли это сообщение последним в чате
      const latestMessage = await this.messagesRepository.findOne({
        where: [
          { senderId: smallerId, receiverId: largerId },
          { senderId: largerId, receiverId: smallerId },
        ],
        order: { createdAt: 'DESC' },
      });

      if (latestMessage && latestMessage.id === id) {
        chat.lastMessageContent = updateMessageDto.content || '';
        await this.chatsRepository.save(chat);
      }
    }

    return updatedMessage;
  }

  async remove(id: string, userId: string) {
    // Находим сообщение
    const message = await this.messagesRepository.findOne({ where: { id } });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Проверяем, что пользователь является отправителем сообщения
    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    // Сохраняем данные о сообщении перед удалением
    const { senderId, receiverId } = message;

    // Удаляем сообщение
    await this.messagesRepository.remove(message);

    // Обновляем чат, если удаленное сообщение было последним
    const [smallerId, largerId] =
      senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];

    const chat = await this.chatsRepository.findOne({
      where: { user1Id: smallerId, user2Id: largerId },
    });

    if (chat) {
      // Находим новое последнее сообщение
      const latestMessage = await this.messagesRepository.findOne({
        where: [
          { senderId: smallerId, receiverId: largerId },
          { senderId: largerId, receiverId: smallerId },
        ],
        order: { createdAt: 'DESC' },
      });

      if (latestMessage) {
        // Обновляем превью чата
        chat.lastMessageContent = latestMessage.content || '📷 Image';
        await this.chatsRepository.save(chat);
      } else {
        // Если сообщений больше нет, можно либо удалить чат, либо оставить с пометкой
        chat.lastMessageContent = 'No messages';
        await this.chatsRepository.save(chat);
      }
    }

    return { success: true, message: `Message with ID ${id} has been deleted` };
  }
}
