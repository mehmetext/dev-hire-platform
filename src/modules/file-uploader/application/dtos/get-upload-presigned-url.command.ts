import { FileUploadType } from '../../domain/enums/file-upload-type.enum';

export class GetUploadPresignedUrlCommand {
  constructor(
    public readonly type: FileUploadType,
    public readonly contentType: string,
    public readonly userId: string,
  ) {}
}
