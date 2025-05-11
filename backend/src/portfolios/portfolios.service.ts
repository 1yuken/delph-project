import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {}

  async create(
    createPortfolioDto: CreatePortfolioDto,
    userId: string,
    imagePath: string,
  ) {
    const portfolio = this.portfolioRepository.create({
      ...createPortfolioDto,
      userId,
      imagePath,
    });
    return await this.portfolioRepository.save(portfolio);
  }

  async findAll() {
    return await this.portfolioRepository.find();
  }

  async findAllByUserId(userId: string) {
    return await this.portfolioRepository.find({ where: { userId } });
  }

  async findOne(id: number) {
    const portfolio = await this.portfolioRepository.findOne({ where: { id } });
    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }
    return portfolio;
  }

  async findOneWithUser(id: number) {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }
    return portfolio;
  }

  async update(
    id: number,
    updatePortfolioDto: UpdatePortfolioDto,
    userId: string,
    imagePath?: string,
  ) {
    const portfolio = await this.findOne(id);

    if (portfolio.userId !== userId) {
      throw new ForbiddenException(
        'You can only update your own portfolio items',
      );
    }

    const updateData = { ...updatePortfolioDto };
    if (imagePath) {
      updateData['imagePath'] = imagePath;
    }

    await this.portfolioRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number, userId: string) {
    const portfolio = await this.findOne(id);

    if (portfolio.userId !== userId) {
      throw new ForbiddenException(
        'You can only delete your own portfolio items',
      );
    }

    await this.portfolioRepository.delete(id);
    return { success: true };
  }
}
