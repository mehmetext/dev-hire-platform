import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { FileUploadType } from '../../domain/enums/file-upload-type.enum';

export class GetDownloadPresignedUrlDto {
  @ApiProperty({
    description: 'Object key inside the bucket, e.g. avatars/user-1.png',
    example: 'avatars/user-1.png',
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Type of file that will be uploaded',
    enum: Object.values(FileUploadType),
    example: FileUploadType.CV,
  })
  @IsEnum(FileUploadType)
  type: FileUploadType;
}
