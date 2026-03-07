import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateJobQuestionAnswerDto } from './create-job-question-answer.dto';

export class ApplyJobDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the candidate CV',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  candidateCVId: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The answers to the job questions',
    type: [CreateJobQuestionAnswerDto],
  })
  jobQuestionAnswers: CreateJobQuestionAnswerDto[];
}
