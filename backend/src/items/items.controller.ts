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

  @Post('seed')
  @ApiOperation({ summary: 'Создать тестовые данные' })
  async seed() {
    const testItems = [
      {
        name: 'Vue.js',
        categories: 'Разработка, Frontend, JavaScript',
        imageUrl: 'https://vuejs.org/images/logo.png',
      },
      {
        name: 'React',
        categories: 'Разработка, Frontend, JavaScript',
        imageUrl: 'https://reactjs.org/logo-og.png',
      },
      {
        name: 'Figma',
        categories: 'Дизайн, UI/UX, Прототипирование',
        imageUrl:
          'https://static.figma.com/api/figma-extension-api/figma-logo.png',
      },
      {
        name: 'Photoshop',
        categories: 'Дизайн, Графика, Фоторедактирование',
        imageUrl:
          'https://www.adobe.com/content/dam/cc/us/en/creative-cloud/max2020/mnemonics/photoshop.svg',
      },
      {
        name: 'SEO',
        categories: 'Маркетинг, Оптимизация, Поисковые системы',
        imageUrl:
          'https://www.searchenginejournal.com/wp-content/uploads/2020/08/seo-guide-5f3a7b9e24a96.png',
      },
    ];

    const createdItems = [];
    for (const item of testItems) {
      const createItemDto = new CreateItemDto();
      createItemDto.name = item.name;
      createItemDto.categories = item.categories;
      createItemDto.imageUrl = item.imageUrl;
      const created = await this.itemsService.create(createItemDto);
      createdItems.push(created);
    }

    return createdItems;
  }

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
