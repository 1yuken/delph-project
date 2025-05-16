import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere, In } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    clientId: string,
  ): Promise<Order> {
    // Проверяем существование клиента
    const client = await this.usersService.findOne(clientId);

    // Проверяем существование навыка
    const item = await this.itemsService.findOne(createOrderDto.itemId);

    // Валидация категорий (Вариант 1)
    if (createOrderDto.categories) {
      const orderCategories = createOrderDto.categories
        .split(',')
        .map((c) => c.trim());
      const itemCategories = item.categories
        ? item.categories.split(',').map((c) => c.trim())
        : [];

      // Проверяем, что все категории заказа есть в категориях навыка
      const invalidCategories = orderCategories.filter(
        (c) => !itemCategories.includes(c),
      );

      if (invalidCategories.length > 0) {
        throw new BadRequestException(
          `Следующие категории не соответствуют навыку ${item.name}: ${invalidCategories.join(', ')}`,
        );
      }
    } else {
      // Если категории не указаны, используем категории навыка
      createOrderDto.categories = item.categories;
    }

    // Создаем новый заказ
    const order = this.ordersRepository.create({
      ...createOrderDto,
      clientId,
    });

    // Если указан ID исполнителя, проверяем его существование и статус фрилансера
    if (createOrderDto.performerId) {
      const performer = await this.usersService.findOne(
        createOrderDto.performerId,
      );

      if (!performer.isFreelancer) {
        throw new BadRequestException(
          'Указанный пользователь не является фрилансером',
        );
      }

      // Если заказ сразу назначается исполнителю, меняем статус
      order.status = OrderStatus.IN_PROGRESS;
    }

    return this.ordersRepository.save(order);
  }

  async findAll(
    queryDto: OrderQueryDto,
  ): Promise<{ orders: Order[]; total: number }> {
    const {
      status,
      clientId,
      performerId,
      itemId,
      category,
      search,
      page = 1,
      limit = 10,
    } = queryDto;
    const skip = (page - 1) * limit;

    // Формируем условия поиска
    const where: FindOptionsWhere<Order> = {};

    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (performerId) {
      where.performerId = performerId;
    }

    if (itemId) {
      where.itemId = itemId;
    }

    // Поиск по категории (используем ILIKE для поиска в строке категорий)
    if (category) {
      where.categories = ILike(`%${category}%`);
    }

    // Поиск по названию и описанию
    // Для поиска по нескольким полям нужно использовать более сложный запрос
    let queryBuilder = this.ordersRepository.createQueryBuilder('order');

    // Применяем базовые условия
    if (Object.keys(where).length > 0) {
      queryBuilder = queryBuilder.where(where);
    }

    // Добавляем поиск по названию и описанию, если указан поисковый запрос
    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(order.title ILIKE :search OR order.description ILIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    // Добавляем пагинацию и сортировку
    queryBuilder = queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('order.creationDate', 'DESC')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.performer', 'performer')
      .leftJoinAndSelect('order.item', 'item');

    const [orders, total] = await queryBuilder.getManyAndCount();

    return { orders, total };
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['client', 'performer', 'item'],
    });

    if (!order) {
      throw new NotFoundException(`Заказ с ID ${id} не найден`);
    }

    return order;
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
    userId: string,
  ): Promise<Order> {
    const order = await this.findOne(id);

    // Проверяем права доступа: только клиент или исполнитель могут обновлять заказ
    if (order.clientId !== userId && order.performerId !== userId) {
      throw new ForbiddenException(
        'У вас нет прав для обновления этого заказа',
      );
    }

    // Если меняется itemId, проверяем существование навыка и обновляем категории
    if (updateOrderDto.itemId && updateOrderDto.itemId !== order.itemId) {
      const item = await this.itemsService.findOne(updateOrderDto.itemId);

      // Если категории не указаны в DTO, используем категории нового навыка
      if (!updateOrderDto.categories) {
        updateOrderDto.categories = item.categories;
      } else {
        // Валидация категорий (Вариант 1)
        const orderCategories = updateOrderDto.categories
          .split(',')
          .map((c) => c.trim());
        const itemCategories = item.categories
          ? item.categories.split(',').map((c) => c.trim())
          : [];

        // Проверяем, что все категории заказа есть в категориях навыка
        const invalidCategories = orderCategories.filter(
          (c) => !itemCategories.includes(c),
        );

        if (invalidCategories.length > 0) {
          throw new BadRequestException(
            `Следующие категории не соответствуют навыку ${item.name}: ${invalidCategories.join(', ')}`,
          );
        }
      }
    } else if (updateOrderDto.categories && !updateOrderDto.itemId) {
      // Если меняются только категории, но не меняется навык
      const item = await this.itemsService.findOne(order.itemId);

      // Валидация категорий (Вариант 1)
      const orderCategories = updateOrderDto.categories
        .split(',')
        .map((c) => c.trim());
      const itemCategories = item.categories
        ? item.categories.split(',').map((c) => c.trim())
        : [];

      // Проверяем, что все категории заказа есть в категориях навыка
      const invalidCategories = orderCategories.filter(
        (c) => !itemCategories.includes(c),
      );

      if (invalidCategories.length > 0) {
        throw new BadRequestException(
          `Следующие категории не соответствуют навыку ${item.name}: ${invalidCategories.join(', ')}`,
        );
      }
    }

    // Если меняется статус на "completed", устанавливаем дату завершения
    if (
      updateOrderDto.status === OrderStatus.COMPLETED &&
      order.status !== OrderStatus.COMPLETED
    ) {
      order.completionDate = new Date();
    }

    // Если указан новый исполнитель, проверяем его статус фрилансера
    if (
      updateOrderDto.performerId &&
      updateOrderDto.performerId !== order.performerId
    ) {
      const performer = await this.usersService.findOne(
        updateOrderDto.performerId,
      );

      if (!performer.isFreelancer) {
        throw new BadRequestException(
          'Указанный пользователь не является фрилансером',
        );
      }

      // Если заказ назначается новому исполнителю, меняем статус на "в процессе"
      if (order.status === OrderStatus.OPEN) {
        order.status = OrderStatus.IN_PROGRESS;
      }
    }

    // Обновляем заказ
    const updatedOrder = this.ordersRepository.merge(order, updateOrderDto);
    return this.ordersRepository.save(updatedOrder);
  }

  async remove(id: number, userId: string): Promise<void> {
    const order = await this.findOne(id);

    // Проверяем права доступа: только клиент может удалить заказ
    if (order.clientId !== userId) {
      throw new ForbiddenException('У вас нет прав для удаления этого заказа');
    }

    // Проверяем, что заказ не находится в процессе выполнения или не завершен
    if (
      order.status === OrderStatus.IN_PROGRESS ||
      order.status === OrderStatus.COMPLETED
    ) {
      throw new ForbiddenException(
        'Нельзя удалить заказ, который находится в процессе выполнения или завершен',
      );
    }

    // Удаляем заказ
    await this.ordersRepository.remove(order);
  }

  async findByItemId(itemId: number) {
    return this.ordersRepository.find({
      where: { itemId },
      relations: ['client', 'performer', 'item'],
    });
  }

  async findByItemName(itemName: string) {
    // Сначала находим навык по имени
    const items = await this.itemsService.findByName(itemName);

    if (items.length === 0) {
      return [];
    }

    // Получаем ID найденных навыков
    const itemIds = items.map((item) => item.id);

    // Находим заказы по ID навыков
    return this.ordersRepository.find({
      where: { itemId: In(itemIds) },
      relations: ['client', 'performer', 'item'],
    });
  }

  async findByCategory(category: string) {
    return this.ordersRepository.find({
      where: { categories: ILike(`%${category}%`) },
      relations: ['client', 'performer', 'item'],
    });
  }

  async assignPerformer(
    id: number,
    performerId: string,
    clientId: string,
  ): Promise<Order> {
    const order = await this.findOne(id);

    // Проверяем права доступа: только клиент может назначить исполнителя
    if (order.clientId !== clientId) {
      throw new ForbiddenException('У вас нет прав для назначения исполнителя');
    }

    // Проверяем, что заказ не завершен и не отменен
    if (
      order.status === OrderStatus.COMPLETED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new ForbiddenException(
        'Нельзя назначить исполнителя для завершенного или отмененного заказа',
      );
    }

    // Проверяем существование исполнителя и его статус фрилансера
    const performer = await this.usersService.findOne(performerId);

    if (!performer.isFreelancer) {
      throw new BadRequestException(
        'Указанный пользователь не является фрилансером',
      );
    }

    // Обновляем заказ
    order.performerId = performerId;
    order.status = OrderStatus.IN_PROGRESS;

    return this.ordersRepository.save(order);
  }

  async completeOrder(id: number, userId: string): Promise<Order> {
    const order = await this.findOne(id);

    // Проверяем права доступа: только клиент или исполнитель могут завершить заказ
    if (order.clientId !== userId && order.performerId !== userId) {
      throw new ForbiddenException(
        'У вас нет прав для завершения этого заказа',
      );
    }

    // Проверяем, что заказ находится в процессе выполнения
    if (order.status !== OrderStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Можно завершить только заказ, находящийся в процессе выполнения',
      );
    }

    // Обновляем заказ
    order.status = OrderStatus.COMPLETED;
    order.completionDate = new Date();

    return this.ordersRepository.save(order);
  }

  async cancelOrder(id: number, userId: string): Promise<Order> {
    const order = await this.findOne(id);

    // Проверяем права доступа: только клиент может отменить заказ
    if (order.clientId !== userId) {
      throw new ForbiddenException('У вас нет прав для отмены этого заказа');
    }

    // Проверяем, что заказ не завершен
    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException('Нельзя отменить завершенный заказ');
    }

    // Обновляем заказ
    order.status = OrderStatus.CANCELLED;

    return this.ordersRepository.save(order);
  }

  async createPayment(
    id: number,
    userId: string,
  ): Promise<{ paymentUrl: string }> {
    const order = await this.findOne(id);

    // Проверяем права доступа: только клиент может оплатить заказ
    if (order.clientId !== userId) {
      throw new ForbiddenException('У вас нет прав для оплаты этого заказа');
    }

    // Проверяем, что заказ находится в статусе "открыт"
    if (order.status !== OrderStatus.OPEN) {
      throw new BadRequestException('Можно оплатить только открытый заказ');
    }

    // Здесь должна быть интеграция с платежной системой
    // Для примера просто возвращаем URL для оплаты
    return {
      paymentUrl: `/payment/${order.id}?amount=${order.budget}`,
    };
  }
}
