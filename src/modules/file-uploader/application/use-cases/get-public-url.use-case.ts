import { Inject } from '@nestjs/common';
import { FileUploaderRepository } from '../repositories/file-uploader.repository';

export class GetPublicUrlUseCase {
  constructor(
    @Inject(FileUploaderRepository)
    private readonly fileUploaderRepository: FileUploaderRepository,
  ) {}

  execute(key: string): string {
    return this.fileUploaderRepository.getPublicUrl(key);
  }
}
