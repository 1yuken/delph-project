import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
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
    return this.usersRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user || !user.isActive) {
      throw new ForbiddenException('User is not found');
    }
    return user;
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
      select: ['id', 'email', 'username', 'password', 'isActive'],
    });
  }

  findOneByEmailWithPassword(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'username', 'password', 'isActive'],
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async updateSkills(id: string, skills: string[]) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new ForbiddenException(`User with ID ${id} not found`);
    }

    user.skills = skills;
    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    // Вместо удаления пользователя и связанных данных,
    // просто обновляем статус пользователя на неактивный
    try {
      // Обновляем пользователя, устанавливая isActive в false
      await this.usersRepository.update(id, {
        isActive: false,
        username: `deactivated_${id}`,
        email: `deactivated_${id}@notexists.com`,
        password: await bcrypt.hash(Math.random().toString(36), 10), // случайный пароль
      });

      return {
        success: true,
        message: 'User has been deactivated successfully',
      };
    } catch (err) {
      this.logger.error(`Failed to deactivate user with ID ${id}`, err.stack);
      throw err;
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
