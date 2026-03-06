import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCompanyProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiPropertyOptional({
    description: 'The name of the company',
    example: 'New Company Name',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The logo URL of the company',
    example: 'https://example.com/new-logo.png',
  })
  logoUrl?: string;
}
