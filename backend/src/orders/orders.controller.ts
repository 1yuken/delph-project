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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { Order } from './entities/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новый заказ' })
  @ApiResponse({
    status: 201,
    description: 'Заказ успешно создан',
    type: Order,
  })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все заказы с фильтрацией и пагинацией' })
  @ApiResponse({ status: 200, description: 'Список заказов', type: [Order] })
  findAll(@Query() queryDto: OrderQueryDto) {
    return this.ordersService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить заказ по ID' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiResponse({ status: 200, description: 'Заказ найден', type: Order })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить заказ' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiResponse({
    status: 200,
    description: 'Заказ успешно обновлен',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req,
  ) {
    return this.ordersService.update(+id, updateOrderDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить заказ' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiResponse({ status: 200, description: 'Заказ успешно удален' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  remove(@Param('id') id: string, @Request() req) {
    return this.ordersService.remove(+id, req.user.userId);
  }

  @Get('item/:itemId')
  @ApiOperation({ summary: 'Получить заказы по ID навыка' })
  @ApiParam({ name: 'itemId', description: 'ID навыка' })
  @ApiResponse({ status: 200, description: 'Список заказов', type: [Order] })
  findByItemId(@Param('itemId') itemId: string) {
    return this.ordersService.findByItemId(+itemId);
  }

  @Get('item-name/:itemName')
  @ApiOperation({ summary: 'Получить заказы по названию навыка' })
  @ApiParam({ name: 'itemName', description: 'Название навыка' })
  @ApiResponse({ status: 200, description: 'Список заказов', type: [Order] })
  findByItemName(@Param('itemName') itemName: string) {
    return this.ordersService.findByItemName(itemName);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Получить заказы по категории' })
  @ApiParam({ name: 'category', description: 'Название категории' })
  @ApiResponse({ status: 200, description: 'Список заказов', type: [Order] })
  findByCategory(@Param('category') category: string) {
    return this.ordersService.findByCategory(category);
  }

  @Post(':id/assign/:performerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Назначить исполнителя для заказа' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiParam({ name: 'performerId', description: 'ID исполнителя' })
  @ApiResponse({
    status: 200,
    description: 'Исполнитель успешно назначен',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Заказ или исполнитель не найден' })
  assignPerformer(
    @Param('id') id: string,
    @Param('performerId') performerId: string,
    @Request() req,
  ) {
    return this.ordersService.assignPerformer(
      +id,
      performerId,
      req.user.userId,
    );
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Завершить заказ' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiResponse({
    status: 200,
    description: 'Заказ успешно завершен',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  completeOrder(@Param('id') id: string, @Request() req) {
    return this.ordersService.completeOrder(+id, req.user.userId);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отменить заказ' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiResponse({
    status: 200,
    description: 'Заказ успешно отменен',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  cancelOrder(@Param('id') id: string, @Request() req) {
    return this.ordersService.cancelOrder(+id, req.user.userId);
  }

  @Get('my/client')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить заказы, где пользователь является клиентом',
  })
  @ApiResponse({ status: 200, description: 'Список заказов', type: [Order] })
  findMyClientOrders(@Request() req) {
    const queryDto: OrderQueryDto = {
      clientId: req.user.userId,
    };
    return this.ordersService.findAll(queryDto);
  }

  @Get('my/performer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить заказы, где пользователь является исполнителем',
  })
  @ApiResponse({ status: 200, description: 'Список заказов', type: [Order] })
  findMyPerformerOrders(@Request() req) {
    const queryDto: OrderQueryDto = {
      performerId: req.user.userId,
    };
    return this.ordersService.findAll(queryDto);
  }

  @Post(':id/payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать платеж для заказа' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiResponse({
    status: 200,
    description: 'Платеж успешно создан',
    type: Order,
  })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async createPayment(@Param('id') id: string, @Request() req) {
    return this.ordersService.createPayment(+id, req.user.userId);
  }
}
