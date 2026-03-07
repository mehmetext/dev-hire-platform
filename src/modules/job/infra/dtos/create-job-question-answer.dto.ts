import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJobQuestionAnswerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the job question',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  jobQuestionId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The answer to the job question',
    example: 'Answer to the question',
  })
  answer: string;
}
