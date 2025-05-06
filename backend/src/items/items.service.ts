import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FileUploadService } from '../file-upload/file-upload.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createItemDto: CreateItemDto, image?: Express.Multer.File) {
    const { name, categories } = createItemDto;

    // Создаем новый объект Item
    const item = new Item();
    item.name = name;

    // Если есть изображение, сохраняем URL
    if (image) {
      item.image = this.fileUploadService.getFileUrl(image.filename);
    }

    // Если указаны категории, сохраняем их
    if (categories) {
      item.categories = categories;
    }

    return this.itemsRepository.save(item);
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<{ items: Item[]; total: number }> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [items, total] = await this.itemsRepository.findAndCount({
      skip,
      take: limit,
    });

    return { items, total };
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itemsRepository.findOne({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  async update(
    id: number,
    updateItemDto: UpdateItemDto,
    image?: Express.Multer.File,
  ): Promise<Item> {
    const item = await this.findOne(id);

    // Обновляем поля, если они указаны в DTO
    if (updateItemDto.name) {
      item.name = updateItemDto.name;
    }

    // Если есть новое изображение, обновляем URL
    if (image) {
      item.image = this.fileUploadService.getFileUrl(image.filename);
    }

    // Если указаны категории, обновляем их
    if (updateItemDto.categories !== undefined) {
      item.categories = updateItemDto.categories;
    }

    return this.itemsRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const result = await this.itemsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
  }

  async findByCategory(category: string): Promise<Item[]> {
    // Используем LIKE для поиска категории в строке категорий
    return this.itemsRepository
      .createQueryBuilder('item')
      .where('item.categories LIKE :category', { category: `%${category}%` })
      .getMany();
  }
}
