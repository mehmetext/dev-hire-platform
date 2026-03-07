import { ApiProperty } from '@nestjs/swagger';
import { JobQuestionType } from '../../domain/enums/job-question-type.enum';

export class JobQuestionResponseDto {
  @ApiProperty({
    description: 'The ID of the job question',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The question of the job question',
    example: 'What is your name?',
  })
  question: string;

  @ApiProperty({
    description: 'The question type of the job question',
    example: JobQuestionType.TEXT,
    enum: JobQuestionType,
  })
  questionType: JobQuestionType;

  @ApiProperty({
    description: 'The is required of the job question',
    example: true,
  })
  isRequired: boolean;

  @ApiProperty({
    description: 'The sort order of the job question',
    example: 1,
  })
  sortOrder: number;

  @ApiProperty({
    description: 'The created at date of the job question',
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at date of the job question',
    example: new Date(),
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The deleted at date of the job question (optional)',
    example: new Date(),
    nullable: true,
  })
  deletedAt?: Date | null;
}
