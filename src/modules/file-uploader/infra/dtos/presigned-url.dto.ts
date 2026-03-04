import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class GetUploadPresignedUrlDto {
  @ApiProperty({
    description: 'Object key inside the bucket, e.g. avatars/user-1.png',
    example: 'avatars/user-1.png',
  })
  @IsString()
  key!: string;

  @ApiProperty({
    description: 'Whether the uploaded file should be publicly accessible',
    example: true,
  })
  @IsBoolean()
  isPublic!: boolean;

  @ApiProperty({
    description: 'MIME type of the file, e.g. image/png',
    example: 'image/png',
  })
  @IsString()
  contentType!: string;

  @ApiProperty({
    description: 'Expiration in seconds for the presigned URL (default: 900s)',
    example: 600,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  expiresInSeconds?: number;
}

export class GetDownloadPresignedUrlDto {
  @ApiProperty({
    description: 'Object key inside the bucket, e.g. avatars/user-1.png',
    example: 'avatars/user-1.png',
  })
  @IsString()
  key!: string;

  @ApiProperty({
    description: 'Whether the file is stored in public bucket',
    example: true,
  })
  @IsBoolean()
  isPublic!: boolean;

  @ApiProperty({
    description: 'Expiration in seconds for the presigned URL (default: 900s)',
    example: 600,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  expiresInSeconds?: number;
}

export class PresignedUrlResponseDto {
  @ApiProperty({
    description: 'Generated presigned URL',
  })
  @IsString()
  url!: string;
}

