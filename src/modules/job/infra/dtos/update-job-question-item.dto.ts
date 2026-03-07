import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { JobQuestionType } from '../../domain/enums/job-question-type.enum';

export class UpdateJobQuestionItemDto {
  @IsUUID()
  @ApiProperty({
    description: 'ID of the job question to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The question text',
    example: 'What is your experience?',
  })
  question?: string;

  @IsOptional()
  @IsEnum(JobQuestionType)
  @ApiPropertyOptional({
    description: 'The question type',
    enum: JobQuestionType,
  })
  questionType?: JobQuestionType;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Whether the question is required',
    example: true,
  })
  isRequired?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Sort order',
    example: 1,
  })
  sortOrder?: number;
}
