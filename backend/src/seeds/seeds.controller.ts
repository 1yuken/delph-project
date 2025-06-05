import { Controller, Post, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedsService } from './seeds.service';

@ApiTags('Seeds')
@Controller('seeds')
export class SeedsController {
  constructor(private readonly seedsService: SeedsService) {}

  @Post('users')
  @ApiOperation({ summary: 'Заполнить базу данных пользователями' })
  @ApiResponse({ status: 201, description: 'Пользователи успешно созданы' })
  async seedUsers() {
    await this.seedsService.seedUsers();
    return { message: 'Пользователи успешно созданы' };
  }

  @Post('items')
  @ApiOperation({ summary: 'Заполнить базу данных технологиями' })
  @ApiResponse({ status: 201, description: 'Технологии успешно созданы' })
  async seedItems() {
    await this.seedsService.seedItems();
    return { message: 'Технологии успешно созданы' };
  }

  @Post('all')
  @ApiOperation({ summary: 'Заполнить всю базу данных' })
  @ApiResponse({ status: 201, description: 'Все данные успешно созданы' })
  async seedAll() {
    return await this.seedsService.seedAll();
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Очистить всю базу данных' })
  @ApiResponse({ status: 200, description: 'База данных очищена' })
  async clearAll() {
    return await this.seedsService.clearAll();
  }
}
