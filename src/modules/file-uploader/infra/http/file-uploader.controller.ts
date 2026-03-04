import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import * as mime from 'mime-types';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { ApiOkResponseGeneric } from 'src/shared/decorators/api-ok-response-generic.decorator';
import { FileUploaderRepository } from '../../application/repositories/file-uploader.repository';
import { FileUploadRules } from '../../domain/file-upload-rules';
import { GetDownloadPresignedUrlResponseDto } from '../dtos/get-download-presigned-url-response.dto';
import { GetDownloadPresignedUrlDto } from '../dtos/get-download-presigned-url.dto';
import { GetUploadPresignedUrlResponseDto } from '../dtos/get-upload-presigned-url-response.dto';
import { GetUploadPresignedUrlDto } from '../dtos/get-upload-presigned-url.dto';

@Controller('files')
export class FileUploaderController {
  constructor(
    @Inject(FileUploaderRepository)
    private readonly fileUploaderRepository: FileUploaderRepository,
  ) {}

  @Post('upload-url')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponseGeneric(GetUploadPresignedUrlResponseDto)
  async getUploadPresignedUrl(
    @Body() body: GetUploadPresignedUrlDto,
    @Req() req: Request & { user: UserResponseDto },
  ): Promise<GetUploadPresignedUrlResponseDto> {
    const rules = FileUploadRules[body.type];

    if (!rules) {
      throw new BadRequestException('Invalid file upload type.');
    }

    if (!rules.allowedMimeTypes.includes(body.contentType)) {
      throw new BadRequestException(
        `Invalid content type for file upload type ${body.type}. Allowed types: ${rules.allowedMimeTypes.join(
          ', ',
        )}`,
      );
    }

    const extension = mime.extension(body.contentType);
    const uniqueId = crypto.randomUUID();

    const key = `${rules.folder}/user-${req.user.id}/${uniqueId}.${extension}`;

    const url = await this.fileUploaderRepository.getUploadPresignedUrl({
      key,
      isPublic: rules.isPublic,
      contentType: body.contentType,
    });

    return { url, key };
  }

  @Post('download-url')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponseGeneric(GetDownloadPresignedUrlResponseDto)
  async getDownloadPresignedUrl(
    @Body() body: GetDownloadPresignedUrlDto,
  ): Promise<GetDownloadPresignedUrlResponseDto> {
    const rules = FileUploadRules[body.type];

    if (!rules) {
      throw new BadRequestException('Invalid file upload type.');
    }

    const url = await this.fileUploaderRepository.getDownloadPresignedUrl({
      key: body.key,
      isPublic: rules.isPublic,
    });

    return { url };
  }
}
