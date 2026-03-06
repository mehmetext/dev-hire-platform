import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { ApiOkResponseGeneric } from 'src/shared/decorators/api-ok-response-generic.decorator';
import { GetDownloadPresignedUrlCommand } from '../../application/dtos/get-download-presigned-url.command';
import { GetUploadPresignedUrlCommand } from '../../application/dtos/get-upload-presigned-url.command';
import { GetDownloadPresignedUrlUseCase } from '../../application/use-cases/get-download-presigned-url.use-case';
import { GetUploadPresignedUrlUseCase } from '../../application/use-cases/get-upload-presigned-url.use-case';
import { GetDownloadPresignedUrlResponseDto } from '../dtos/get-download-presigned-url-response.dto';
import { GetDownloadPresignedUrlDto } from '../dtos/get-download-presigned-url.dto';
import { GetUploadPresignedUrlResponseDto } from '../dtos/get-upload-presigned-url-response.dto';
import { GetUploadPresignedUrlDto } from '../dtos/get-upload-presigned-url.dto';

@Controller('files')
export class FileUploaderController {
  constructor(
    @Inject(GetUploadPresignedUrlUseCase)
    private readonly getUploadPresignedUrlUseCase: GetUploadPresignedUrlUseCase,
    @Inject(GetDownloadPresignedUrlUseCase)
    private readonly getDownloadPresignedUrlUseCase: GetDownloadPresignedUrlUseCase,
  ) {}

  @Post('upload-url')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponseGeneric(GetUploadPresignedUrlResponseDto)
  async getUploadPresignedUrl(
    @Body() body: GetUploadPresignedUrlDto,
    @Req() req: Request & { user: UserResponseDto },
  ): Promise<GetUploadPresignedUrlResponseDto> {
    return this.getUploadPresignedUrlUseCase.execute(
      new GetUploadPresignedUrlCommand(
        body.type,
        body.contentType,
        req.user.id,
      ),
    );
  }

  @Post('download-url')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponseGeneric(GetDownloadPresignedUrlResponseDto)
  async getDownloadPresignedUrl(
    @Body() body: GetDownloadPresignedUrlDto,
  ): Promise<GetDownloadPresignedUrlResponseDto> {
    return this.getDownloadPresignedUrlUseCase.execute(
      new GetDownloadPresignedUrlCommand(body.type, body.key),
    );
  }
}
