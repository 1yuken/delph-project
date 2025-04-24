import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Request,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile ' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - email or username already exists',
  })
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId;

    // Проверяем только разрешенные поля
    const allowedFields = ['email', 'username', 'bio'];
    const filteredDto = Object.keys(updateUserDto)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateUserDto[key];
        return obj;
      }, {});

    console.log(filteredDto);

    // Проверка на уникальность email и username
    if (filteredDto['email']) {
      const existingUserWithEmail = await this.usersService.findOneByEmail(
        filteredDto['email'],
      );
      if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
        throw new BadRequestException(
          'Пользователь с таким email уже существует',
        );
      }
    }

    if (filteredDto['username']) {
      const existingUserWithUsername =
        await this.usersService.findOneByUsername(filteredDto['username']);
      if (existingUserWithUsername && existingUserWithUsername.id !== userId) {
        throw new BadRequestException(
          'Пользователь с таким username уже существует',
        );
      }
    }

    return this.usersService.update(userId, filteredDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('upload-avatar')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User profile picture',
    type: FileUploadDto,
  })
  async uploadAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded or file is invalid');
    }

    return this.usersService.updateAvatar(req.user.username, file);
  }
}
