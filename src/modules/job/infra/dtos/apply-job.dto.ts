import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyJobDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the candidate CV',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  candidateCVId: string;
}
