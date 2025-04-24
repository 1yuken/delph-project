import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly fileUploadService: FileUploadService,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(newUser);

    const { password, ...userWithoutPassword } = savedUser;
    const token = await this.authService.login(userWithoutPassword);

    return {
      ...token,
      user: userWithoutPassword,
    };
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { username },
    });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  findOneByUsernameWithPassword(username: string) {
    return this.usersRepository.findOne({
      where: { username },
      select: ['id', 'email', 'username', 'password'],
    });
  }

  findOneByEmailWithPassword(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password'],
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Удаляем все отзывы, где пользователь является отправителем или получателем
      // Используем правильные имена полей из entity
      await queryRunner.manager.query(
        `DELETE FROM review WHERE sender_id = $1 OR receiver_id = $1`,
        [id],
      );

      // Удаляем все сообщения, где пользователь является отправителем или получателем
      await queryRunner.manager.query(
        `DELETE FROM message WHERE "senderId" = $1 OR "receiverId" = $1`,
        [id],
      );

      // Удаляем все чаты, где пользователь участвует
      await queryRunner.manager.query(
        `DELETE FROM chat WHERE "user1Id" = $1 OR "user2Id" = $1`,
        [id],
      );

      // Здесь можно добавить удаление других связанных сущностей
      // ...

      // Наконец, удаляем самого пользователя
      await queryRunner.manager.delete('user', { id });

      // Если всё прошло успешно, фиксируем транзакцию
      await queryRunner.commitTransaction();
    } catch (err) {
      // В случае ошибки откатываем все изменения
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // Освобождаем queryRunner
      await queryRunner.release();
    }
  }

  async updateAvatar(username: string, file: Express.Multer.File) {
    const userId = await this.findOneByUsername(username);

    this.logger.log(
      `Updating avatar for user ${userId.id} with file ${file.filename}`,
    );

    const avatarUrl = this.fileUploadService.getFileUrl(file.filename);

    await this.usersRepository.update(userId.id, { avatarUrl });

    return {
      success: true,
      avatarUrl,
      message: 'Avatar successfully uploaded',
    };
  }
}
