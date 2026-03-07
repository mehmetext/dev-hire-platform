import { Inject, Injectable } from '@nestjs/common';
import * as mime from 'mime-types';
import {
  InvalidFileUploadContentTypeError,
  InvalidFileUploadTypeError,
} from '../../domain/errors';
import { FileUploadRules } from '../../domain/file-upload-rules';
import { GetUploadPresignedUrlCommand } from '../dtos/get-upload-presigned-url.command';
import { GetUploadPresignedUrlResult } from '../dtos/get-upload-presigned-url.result';
import { FileUploaderRepository } from '../repositories/file-uploader.repository';

@Injectable()
export class GetUploadPresignedUrlUseCase {
  constructor(
    @Inject(FileUploaderRepository)
    private readonly fileUploaderRepository: FileUploaderRepository,
  ) {}

  async execute(
    command: GetUploadPresignedUrlCommand,
  ): Promise<GetUploadPresignedUrlResult> {
    const rules = FileUploadRules[command.type];

    if (!rules) {
      throw new InvalidFileUploadTypeError();
    }

    if (!rules.allowedMimeTypes.includes(command.contentType)) {
      throw new InvalidFileUploadContentTypeError(
        command.contentType,
        rules.allowedMimeTypes,
      );
    }

    const extension = mime.extension(command.contentType);
    const uniqueId = crypto.randomUUID();

    const key = `${rules.folder}/user-${command.userId}/${uniqueId}.${extension}`;

    const { url, fields } =
      await this.fileUploaderRepository.getUploadPresignedUrl({
        key,
        isPublic: rules.isPublic,
        contentType: command.contentType,
        maxSizeMb: rules.maxSizeMb,
      });

    return new GetUploadPresignedUrlResult(url, fields, key);
  }
}
