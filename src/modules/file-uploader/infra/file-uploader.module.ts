import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileUploaderRepository } from '../application/repositories/file-uploader.repository';
import { FileUploaderController } from './http/file-uploader.controller';
import { S3FileUploaderRepository } from './services/s3-file-uploader.repository';

@Module({
  imports: [ConfigModule],
  controllers: [FileUploaderController],
  providers: [
    {
      provide: FileUploaderRepository,
      useClass: S3FileUploaderRepository,
    },
  ],
  exports: [FileUploaderRepository],
})
export class FileUploaderModule {}
