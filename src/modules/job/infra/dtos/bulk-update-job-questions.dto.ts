import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { UpdateJobQuestionItemDto } from './update-job-question-item.dto';

export class BulkUpdateJobQuestionsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateJobQuestionItemDto)
  @ApiProperty({
    description: 'List of job questions to update (each must have id)',
    type: [UpdateJobQuestionItemDto],
  })
  questions: UpdateJobQuestionItemDto[];
}
