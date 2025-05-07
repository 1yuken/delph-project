import {
  forwardRef,
  Inject,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string) {
    let user;
    // Try to find by email first
    user = await this.usersService.findOneByEmailWithPassword(login);
    // If not found, try by email
    if (!user) {
      user = await this.usersService.findOneByUsernameWithPassword(login);
    }

    if (!user || !user.isActive) {
      throw new ForbiddenException('User not found');
    }

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (user && isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw new ForbiddenException('Error comparing passwords:', error);
    }
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async changePassword(
    user: any,
    currentPassword: string,
    newPassword: string,
  ) {
    // Получаем пользователя из базы данных
    const userFromDb = await this.usersService.findOneByUsernameWithPassword(
      user.username,
    );
    if (!userFromDb) {
      throw new ForbiddenException('User not found');
    }

    // Проверяем текущий пароль
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      userFromDb.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Current password is incorrect');
    }

    if (newPassword === currentPassword) {
      throw new ForbiddenException(
        'New password must be different from the current password',
      );
    }
    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Используем существующий update-user.dto для обновления пароля
    await this.usersService.update(userFromDb.id, {
      password: hashedPassword,
    });

    return { success: true, message: 'Password successfully changed' };
  }

  async getProfile(user: any) {
    return this.usersService.findOne(user.userId);
  }
}
