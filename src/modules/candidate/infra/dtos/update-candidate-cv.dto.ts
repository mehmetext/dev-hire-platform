import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCandidateCvDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The title of the candidate CV',
    example: 'Updated Senior Backend Engineer CV',
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The URL of the candidate CV',
    example: 'https://example.com/updated-cv.pdf',
  })
  url?: string;
}
