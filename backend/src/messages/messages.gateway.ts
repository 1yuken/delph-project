import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(MessagesGateway.name);
  public userSocketMap = new Map<string, string>(); // userId -> socketId
  private socketUserMap = new Map<string, string>(); // socketId -> userId

  @WebSocketServer()
  public server: Server;

  constructor(
    private messagesService: MessagesService,
    private authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(
          `Client ${client.id} tried to connect without a token`,
        );
        client.disconnect();
        return;
      }

      // Verify token using AuthService
      const decoded = this.authService.verifyToken(token);
      const userId = decoded.sub || decoded.userId;

      if (!userId) {
        this.logger.warn(`Invalid token for client ${client.id}`);
        client.disconnect();
        return;
      }

      // Store the connection
      this.userSocketMap.set(userId.toString(), client.id);
      this.socketUserMap.set(client.id, userId.toString());

      // Set userId in socket data
      client.data.userId = userId.toString();

      // Join a room with the user's ID
      client.join(`user_${userId}`);

      this.logger.log(`Client connected: ${client.id}, User: ${userId}`);

      // Notify the user that they are online
      client.emit('connection_established', {
        status: 'connected',
        userId: userId,
      });

      // Get unread count and send it to the user
      const unreadCount = await this.messagesService.getUnreadCount(
        userId.toString(),
      );
      client.emit('unread_count', { unreadCount });

      // Get and send initial chats
      const chats = await this.messagesService.getChats(userId.toString());
      client.emit('chats_updated', chats);
    } catch (error) {
      this.logger.error(`Error during connection: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketUserMap.get(client.id);
    if (userId) {
      this.userSocketMap.delete(userId);
      this.socketUserMap.delete(client.id);
      this.logger.log(`Client disconnected: ${client.id}, User: ${userId}`);
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { content: string; receiverId: string },
  ) {
    try {
      const currentUserId = this.socketUserMap.get(client.id);
      if (!currentUserId) {
        client.emit('error', { message: 'Unauthorized' });
        return;
      }

      // Create message using the service
      const message = await this.messagesService.create(
        { userId: currentUserId },
        { content: data.content, receiverId: data.receiverId },
      );

      // Format message for sending
      const messageToSend = {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        receiverId: message.receiverId,
        createdAt: message.createdAt,
        sender: message.sender,
        receiver: message.receiver,
        isRead: message.isRead,
      };

      // Send to sender's room
      this.server
        .to(`user_${currentUserId}`)
        .emit('message_sent', messageToSend);

      // Send to receiver's room if online
      const receiverSocket = this.userSocketMap.get(data.receiverId);
      if (receiverSocket) {
        this.server
          .to(`user_${data.receiverId}`)
          .emit('new_message', messageToSend);
      }

      // Update chats for both users
      const chats = await this.messagesService.getChats(currentUserId);
      this.server.to(`user_${currentUserId}`).emit('chats_updated', chats);

      if (receiverSocket) {
        const receiverChats = await this.messagesService.getChats(
          data.receiverId,
        );
        this.server
          .to(`user_${data.receiverId}`)
          .emit('chats_updated', receiverChats);

        // Get and send unread count for receiver
        const unreadCount = await this.messagesService.getUnreadCount(
          data.receiverId,
          currentUserId
        );
        this.server
          .to(`user_${data.receiverId}`)
          .emit('unread_count_updated', { unreadCount });
      }

      return messageToSend;
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    try {
      const currentUserId = this.socketUserMap.get(client.id);
      if (!currentUserId) {
        client.emit('error', { message: 'Unauthorized' });
        return;
      }

      await this.messagesService.markAsRead(currentUserId, data.userId);

      // Get updated unread count
      const unreadCount =
        await this.messagesService.getUnreadCount(currentUserId);

      // Emit to the current user
      client.emit('messages_marked_read', {
        success: true,
        unreadCount,
        otherUserId: data.userId,
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Error marking messages as read: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('get_chats')
  async handleGetChats(@ConnectedSocket() client: Socket) {
    try {
      const userId = this.socketUserMap.get(client.id);
      if (!userId) {
        client.emit('error', { message: 'Unauthorized' });
        return;
      }

      const chats = await this.messagesService.getChats(userId);
      client.emit('chats_list', chats);

      return chats;
    } catch (error) {
      this.logger.error(`Error getting chats: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('get_messages')
  async handleGetMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    getMessagesDto: { userId: string; limit?: number; offset?: number },
  ) {
    try {
      const currentUserId = this.socketUserMap.get(client.id);
      if (!currentUserId) {
        client.emit('error', { message: 'Unauthorized' });
        return;
      }

      const messages = await this.messagesService.getMessages(
        currentUserId,
        getMessagesDto,
      );
      client.emit('messages_list', messages);

      return messages;
    } catch (error) {
      this.logger.error(`Error getting messages: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { receiverId: string; isTyping: boolean },
  ) {
    try {
      const userId = this.socketUserMap.get(client.id);
      if (!userId) {
        client.emit('error', { message: 'Unauthorized' });
        return;
      }

      // Get the receiver's socket
      const receiverSocketId = this.userSocketMap.get(data.receiverId);
      if (receiverSocketId) {
        // Emit typing status to the receiver
        this.server.to(receiverSocketId).emit('user_typing', {
          userId,
          isTyping: data.isTyping,
        });
      }
    } catch (error) {
      this.logger.error(`Error handling typing event: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }
}
