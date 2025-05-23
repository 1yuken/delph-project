import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { GetMessagesDto } from './dto/get-messages.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MessageUploadDto } from './dto/message-upload.dto';
import { Express } from 'express';
import { MessagesGateway } from './messages.gateway';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  private readonly logger = new Logger(MessagesController.name);
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  @ApiOperation({ summary: 'Send a message' })
  @Post()
  @ApiResponse({
    status: 201,
    description: 'The message has been successfully sent.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async create(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    try {
      this.logger.log(
        `Creating message from ${req.user.userId} to ${createMessageDto.receiverId}`,
      );

      if (!req.user || !req.user.userId) {
        this.logger.error('User not authenticated');
        throw new UnauthorizedException('User not authenticated');
      }

      const result = await this.messagesService.create(
        req.user,
        createMessageDto,
      );
      this.logger.debug('Message created successfully:', result);

      // Emit WebSocket events
      const messageToSend = {
        id: result.id,
        content: result.content,
        senderId: result.senderId,
        receiverId: result.receiverId,
        createdAt: result.createdAt,
        sender: result.sender,
        receiver: result.receiver,
        isRead: result.isRead,
      };

      // Send to sender's room
      this.messagesGateway.server
        .to(`user_${req.user.userId}`)
        .emit('message_sent', messageToSend);

      // Send to receiver's room if online
      const receiverSocket = this.messagesGateway.userSocketMap.get(
        createMessageDto.receiverId,
      );
      if (receiverSocket) {
        this.messagesGateway.server
          .to(`user_${createMessageDto.receiverId}`)
          .emit('new_message', messageToSend);
      }

      // Update chats for both users
      const chats = await this.messagesService.getChats(req.user.userId);
      this.messagesGateway.server
        .to(`user_${req.user.userId}`)
        .emit('chats_updated', chats);

      if (receiverSocket) {
        const receiverChats = await this.messagesService.getChats(
          createMessageDto.receiverId,
        );
        this.messagesGateway.server
          .to(`user_${createMessageDto.receiverId}`)
          .emit('chats_updated', receiverChats);

        // Get and send unread count for receiver
        const unreadCount = await this.messagesService.getUnreadCount(
          createMessageDto.receiverId,
          req.user.userId,
        );

        this.messagesGateway.server
          .to(`user_${createMessageDto.receiverId}`)
          .emit('unread_count_updated', { unreadCount });
      }

      return result;
    } catch (error) {
      this.logger.error('Error in create message:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to create message: ${error.message}`,
      );
    }
  }

  @ApiOperation({ summary: 'Send a message with an attachment' })
  @Post('with-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Message with image',
    type: MessageUploadDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiResponse({
    status: 201,
    description: 'The message with image has been successfully sent.',
  })
  async createWithImage(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() messageData: { content?: string; receiverId: string },
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded or image is invalid');
    }

    this.logger.log(
      `Creating message with image from ${req.user.userId} to ${messageData.receiverId}`,
    );
    return this.messagesService.createWithImage(req.user, messageData, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Get messages with a specific user or all messages',
  })
  @ApiResponse({
    status: 200,
    description: 'Return messages.',
  })
  async getMessages(@Request() req, @Query() getMessagesDto: GetMessagesDto) {
    return this.messagesService.getMessages(req.user.userId, getMessagesDto);
  }

  @Get('chats')
  @ApiOperation({ summary: 'Get all chats for current user' })
  @ApiResponse({
    status: 200,
    description: 'Return chats.',
  })
  async getChats(@Request() req) {
    return this.messagesService.getChats(req.user.userId);
  }

  @Post(':userId/read')
  @ApiOperation({ summary: 'Mark messages from a user as read' })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user whose messages to mark as read',
  })
  @ApiResponse({
    status: 200,
    description: 'Messages marked as read.',
  })
  async markAsRead(@Request() req, @Param('userId') userId: string) {
    this.logger.log(
      `Marking messages as read from ${userId} to ${req.user.userId}`,
    );

    await this.messagesService.markAsRead(req.user.userId, userId);

    // Get updated unread count for verification
    const unreadCount = await this.messagesService.getUnreadCount(
      req.user.userId,
    );

    return {
      success: true,
      message: `Messages from user ${userId} marked as read`,
      unreadCount,
    };
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get count of unread messages' })
  @ApiResponse({
    status: 200,
    description: 'Return unread count.',
  })
  async getUnreadCount(@Request() req) {
    this.logger.log(`Getting unread count for user ${req.user.userId}`);
    const count = await this.messagesService.getUnreadCount(req.user.userId);
    return { unreadCount: count };
  }

  // ____ IDK if i should leave methods below

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a message' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiBody({
    description: 'Message update data',
    type: UpdateMessageDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The message has been successfully updated.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only update your own messages.',
  })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    this.logger.log(`Updating message ${id} by user ${req.user.userId}`);
    return this.messagesService.update(id, updateMessageDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiResponse({
    status: 200,
    description: 'The message has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Message not found.' })
  remove(@Request() req, @Param('id') id: string) {
    this.logger.log(`Deleting message ${id} by user ${req.user.userId}`);
    return this.messagesService.remove(id, req.user.userId);
  }
}
