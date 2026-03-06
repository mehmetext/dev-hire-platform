import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class GetUploadPresignedUrlResponseDto {
  @ApiProperty({
    description: 'Generated presigned URL',
  })
  @IsString()
  url: string;

  @ApiProperty({
    description:
      'Presigned POST form fields. Submit these fields along with the file to the `url`.',
    additionalProperties: { type: 'string' },
  })
  @IsObject()
  fields: Record<string, string>;

  @ApiProperty({
    description: 'Object key inside the bucket, e.g. avatars/user-1.png',
    example: 'avatars/user-1.png',
  })
  @IsString()
  key: string;
}
