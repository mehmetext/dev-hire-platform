import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { JobQuestionType } from '../../domain/enums/job-question-type.enum';

export class CreateJobQuestionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The question of the job question',
    example: 'What is your name?',
  })
  question: string;

  @IsEnum(JobQuestionType)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The question type of the job question',
    example: JobQuestionType.TEXT,
  })
  questionType: JobQuestionType;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The is required of the job question',
    example: true,
  })
  isRequired: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The sort order of the job question',
    example: 1,
  })
  sortOrder: number;
}
