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
} from '@nestjs/swagger';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({
    status: 201,
    description: 'The message has been successfully sent.',
  })
  async create(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(req.user.userId, createMessageDto);
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
    await this.messagesService.markAsRead(req.user.userId, userId);
    return { success: true };
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get count of unread messages' })
  @ApiResponse({
    status: 200,
    description: 'Return unread count.',
  })
  async getUnreadCount(@Request() req) {
    const count = await this.messagesService.getUnreadCount(req.user.userId);
    return { unreadCount: count };
  }

  // ____ IDK if i should leave methods below

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
