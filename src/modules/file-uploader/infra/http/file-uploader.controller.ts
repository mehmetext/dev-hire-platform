import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiOkResponseGeneric } from 'src/shared/decorators/api-ok-response-generic.decorator';
import { FileUploaderRepository } from '../../application/repositories/file-uploader.repository';
import {
  GetDownloadPresignedUrlDto,
  GetUploadPresignedUrlDto,
  PresignedUrlResponseDto,
} from '../dtos/presigned-url.dto';

@Controller('files')
export class FileUploaderController {
  constructor(
    @Inject(FileUploaderRepository)
    private readonly fileUploaderRepository: FileUploaderRepository,
  ) {}

  @Post('upload-url')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponseGeneric(PresignedUrlResponseDto)
  async getUploadPresignedUrl(
    @Body() body: GetUploadPresignedUrlDto,
  ): Promise<PresignedUrlResponseDto> {
    const url = await this.fileUploaderRepository.getUploadPresignedUrl({
      key: body.key,
      isPublic: body.isPublic,
      contentType: body.contentType,
      expiresInSeconds: body.expiresInSeconds,
    });

    return { url };
  }

  @Post('download-url')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponseGeneric(PresignedUrlResponseDto)
  async getDownloadPresignedUrl(
    @Body() body: GetDownloadPresignedUrlDto,
  ): Promise<PresignedUrlResponseDto> {
    const url = await this.fileUploaderRepository.getDownloadPresignedUrl({
      key: body.key,
      isPublic: body.isPublic,
      expiresInSeconds: body.expiresInSeconds,
    });

    return { url };
  }
}
