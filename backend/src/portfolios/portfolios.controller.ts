import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('portfolios')
@Controller('portfolios')
export class PortfoliosController {
  private readonly logger = new Logger(PortfoliosController.name);

  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        description: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.portfoliosService.create(
      createPortfolioDto,
      req.user.userId,
      file.path.replace('\\', '/'),
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user portfolios by ID' })
  @ApiResponse({
    status: 200,
    description: 'User portfolios',
  })
  async findUserPortfolios(@Param('userId') userId: string) {
    this.logger.log(`Getting portfolios for user ${userId}`);
    const portfolios = await this.portfoliosService.findAllByUserId(userId);
    this.logger.log(`Found ${portfolios.length} portfolios for user ${userId}`);
    return portfolios;
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findMyPortfolios(@Request() req) {
    return this.portfoliosService.findAllByUserId(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.portfoliosService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.portfoliosService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.portfoliosService.update(
      +id,
      updatePortfolioDto,
      req.user.userId,
      file ? file.path.replace('\\', '/') : undefined,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Request() req) {
    return this.portfoliosService.remove(+id, req.user.userId);
  }
}
