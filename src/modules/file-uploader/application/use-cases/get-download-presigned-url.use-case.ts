import { Inject, Injectable } from '@nestjs/common';
import { FileUploadRules } from '../../domain/file-upload-rules';
import { InvalidFileUploadTypeError } from '../../errors';
import { GetDownloadPresignedUrlCommand } from '../dtos/get-download-presigned-url.command';
import { GetDownloadPresignedUrlResult } from '../dtos/get-download-presigned-url.result';
import { FileUploaderRepository } from '../repositories/file-uploader.repository';

@Injectable()
export class GetDownloadPresignedUrlUseCase {
  constructor(
    @Inject(FileUploaderRepository)
    private readonly fileUploaderRepository: FileUploaderRepository,
  ) {}

  async execute(
    command: GetDownloadPresignedUrlCommand,
  ): Promise<GetDownloadPresignedUrlResult> {
    const rules = FileUploadRules[command.type];

    if (!rules) {
      throw new InvalidFileUploadTypeError();
    }

    const url = await this.fileUploaderRepository.getDownloadPresignedUrl({
      key: command.key,
      isPublic: rules.isPublic,
    });

    return new GetDownloadPresignedUrlResult(url);
  }
}
