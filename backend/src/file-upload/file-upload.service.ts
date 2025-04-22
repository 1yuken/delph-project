import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  getFileUrl(filename: string): string {
    // This should be your server URL in production
    const baseUrl = 'http://localhost:3000';
    const url = `${baseUrl}/uploads/${filename}`;

    this.logger.log(`Generated URL for ${filename}: ${url}`);
    return url;
  }

  getFilePath(filename: string): string {
    return join(process.cwd(), 'uploads', filename);
  }
}
