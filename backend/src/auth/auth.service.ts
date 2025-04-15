import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user =
      await this.usersService.findOneByUsernameWithPassword(username);

    if (!user) {
      console.error('User not found');
      return null;
    }

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return null;
    }
  }

  login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
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
      throw new Error('User not found');
    }

    // Проверяем текущий пароль
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      userFromDb.password,
    );

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    if (newPassword === currentPassword) {
      throw new Error(
        'New password must be different from the current password',
      );
    }
    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Используем существующий update-user.dto для обновления пароля
    const updateUserDto = { password: hashedPassword };
    await this.usersService.update(userFromDb.id, updateUserDto);

    return { success: true, message: 'Password successfully changed' };
  }

  async getProfile(user: any) {
    return this.usersService.findOneByUsername(user.username);
  }
}
