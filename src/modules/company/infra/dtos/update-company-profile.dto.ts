import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

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
  @IsUrl()
  @ApiPropertyOptional({
    description: 'The logo URL of the company',
    example: 'https://example.com/new-logo.png',
  })
  logoUrl?: string;
}
