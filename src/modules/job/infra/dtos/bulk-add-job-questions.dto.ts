import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateJobQuestionDto } from './create-job-question.dto';

export class BulkAddJobQuestionsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateJobQuestionDto)
  @ApiProperty({
    description: 'List of job questions to add',
    type: [CreateJobQuestionDto],
  })
  questions: CreateJobQuestionDto[];
}
