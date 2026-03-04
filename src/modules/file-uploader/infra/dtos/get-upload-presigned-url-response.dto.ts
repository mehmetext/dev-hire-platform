import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetUploadPresignedUrlResponseDto {
  @ApiProperty({
    description: 'Generated presigned URL',
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Object key inside the bucket, e.g. avatars/user-1.png',
    example: 'avatars/user-1.png',
  })
  @IsString()
  key: string;
}
