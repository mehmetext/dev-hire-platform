import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetJobsQueryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The query to search for jobs',
    example: 'Software Engineering',
    required: false,
  })
  query?: string;
}
