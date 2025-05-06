import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый навык' })
  @ApiResponse({ status: 201, description: 'Навык успешно создан', type: Item })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createItemDto: CreateItemDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.itemsService.create(createItemDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все навыки с пагинацией' })
  @ApiResponse({ status: 200, description: 'Список навыков', type: Item })
  findAll(
    @Query()
    paginationQuery: PaginationQueryDto,
  ) {
    return this.itemsService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить навык по ID' })
  @ApiResponse({ status: 200, description: 'Навык найден', type: Item })
  @ApiResponse({ status: 404, description: 'Навык не найден' })
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить навык' })
  @ApiResponse({
    status: 200,
    description: 'Навык успешно обновлен',
    type: Item,
  })
  @ApiResponse({ status: 404, description: 'Навык не найден' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.itemsService.update(+id, updateItemDto, image);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить навык' })
  @ApiResponse({ status: 200, description: 'Навык успешно удален' })
  @ApiResponse({ status: 404, description: 'Навык не найден' })
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Получить навыки по категории' })
  @ApiResponse({
    status: 200,
    description: 'Список навыков по категории',
    type: [Item],
  })
  findByCategory(@Param('category') category: string) {
    return this.itemsService.findByCategory(category);
  }
}
