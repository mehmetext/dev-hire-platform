import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetDownloadPresignedUrlResponseDto {
  @ApiProperty({
    description: 'Generated presigned URL',
  })
  @IsString()
  url: string;
}
