import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCandidateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiPropertyOptional({
    description: 'The first name of the candidate',
    example: 'John',
  })
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiPropertyOptional({
    description: 'The last name of the candidate',
    example: 'Doe',
  })
  lastName?: string;
}
