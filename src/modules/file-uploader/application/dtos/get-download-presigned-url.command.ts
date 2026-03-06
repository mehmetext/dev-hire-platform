import { FileUploadType } from '../../domain/enums/file-upload-type.enum';

export class GetDownloadPresignedUrlCommand {
  constructor(
    public readonly type: FileUploadType,
    public readonly key: string,
  ) {}
}
