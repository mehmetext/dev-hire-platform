import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCandidateCvDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The title of the candidate CV',
    example: 'Senior Backend Engineer CV',
  })
  title?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The URL of the candidate CV',
    example: 'https://example.com/cv.pdf',
  })
  url: string;
}
