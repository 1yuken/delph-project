import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UsersService } from 'src/users/users.service';
import { RespondToReviewDto } from './dto/respond-to-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async create(user: any, createReviewDto: CreateReviewDto) {
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Проверяем существование получателя
    const receiver = await this.usersService.findOne(
      createReviewDto.receiver_id,
    );
    if (!receiver || !receiver.isActive) {
      throw new NotFoundException(
        `Receiver with ID ${createReviewDto.receiver_id} not found`,
      );
    }

    // Проверяем, что пользователь не оставляет отзыв самому себе
    if (user.userId === Number.parseInt(createReviewDto.receiver_id)) {
      throw new ForbiddenException('You cannot leave a review for yourself');
    }

    const review = this.reviewsRepository.create({
      sender_id: user.userId,
      receiver_id: createReviewDto.receiver_id,
      msg: createReviewDto.msg,
      job_id: createReviewDto.job_id,
      rating: createReviewDto.rating,
    });

    return this.reviewsRepository.save(review);
  }

  async respondToReview(
    id: string,
    userId: string,
    respondToReviewDto: RespondToReviewDto,
  ) {
    // Проверяем, что отзыв существует
    const review = await this.reviewsRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Проверяем, что пользователь является получателем отзыва
    if (review.receiver_id !== userId) {
      throw new ForbiddenException(
        'You can only respond to reviews addressed to you',
      );
    }

    // Обновляем отзыв, добавляя ответ
    review.response = respondToReviewDto.response;
    review.responseDate = new Date();

    return this.reviewsRepository.save(review);
  }

  findAll() {
    return this.reviewsRepository.find({
      relations: ['sender', 'receiver'],
    });
  }

  findOne(id: string) {
    return this.reviewsRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });
  }

  findByReceiver(receiverId: string) {
    return this.reviewsRepository.find({
      where: { receiver_id: receiverId },
      relations: ['sender'],
    });
  }

  findBySender(senderId: string) {
    return this.reviewsRepository.find({
      where: { sender_id: senderId },
      relations: ['receiver'],
    });
  }

  async update(id: string, userId: string, updateReviewDto: UpdateReviewDto) {
    // Проверяем, что отзыв существует
    const review = await this.reviewsRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Проверяем, что пользователь является автором отзыва
    if (review.sender_id !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    return this.reviewsRepository.update(id, updateReviewDto);
  }

  async remove(id: string, userId: string) {
    // Проверяем, что отзыв существует
    const review = await this.reviewsRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Проверяем, что пользователь является автором отзыва
    if (review.sender_id !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    return this.reviewsRepository.delete(id);
  }

  // Метод для получения среднего рейтинга пользователя
  async getAverageRating(userId: string) {
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'averageRating')
      .addSelect('COUNT(review.id)', 'totalReviews')
      .where('review.receiver_id = :userId', { userId })
      .getRawOne();

    return {
      averageRating: result.averageRating
        ? Number.parseFloat(result.averageRating).toFixed(1)
        : null,
      totalReviews: Number.parseInt(result.totalReviews),
    };
  }
}
