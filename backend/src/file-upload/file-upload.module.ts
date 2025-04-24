import { Module, ForbiddenException } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = './uploads';
          // Create the uploads directory if it doesn't exist
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          // Generate a unique filename
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(
            new ForbiddenException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    }),
  ],
  providers: [FileUploadService],
  exports: [FileUploadService, MulterModule],
})
export class FileUploadModule {}
