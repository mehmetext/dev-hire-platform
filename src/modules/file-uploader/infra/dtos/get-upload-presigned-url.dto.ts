import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { FileUploadType } from '../../domain/enums/file-upload-type.enum';

export class GetUploadPresignedUrlDto {
  @ApiProperty({
    description: 'Type of file that will be uploaded',
    enum: Object.values(FileUploadType),
    example: FileUploadType.CV,
  })
  @IsEnum(FileUploadType)
  type: FileUploadType;

  @ApiProperty({
    description: 'MIME type of the file, e.g. image/png',
    example: 'image/png',
  })
  @IsString()
  contentType: string;
}
