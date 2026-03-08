import { ApiProperty } from '@nestjs/swagger';
import { CandidateCvResponseDto } from 'src/modules/candidate/infra/dtos/candidate-cv-resposne.dto';
import { CandidateResponseDto } from 'src/modules/candidate/infra/dtos/candidate-response.dto';
import { JobApplicationStatus } from '../../domain/enums/job-application-status.enum';
import { JobQuestionType } from '../../domain/enums/job-question-type.enum';
import { JobResponseWithoutQuestionsDto } from './job-response.dto';

export class JobApplicationQuestionAnswerItemDto {
  @ApiProperty({
    description: 'The ID of the job question',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  questionId: string;

  @ApiProperty({
    description: 'The question text',
    example: 'What is your name?',
  })
  question: string;

  @ApiProperty({
    description: 'The question type',
    enum: JobQuestionType,
  })
  questionType: JobQuestionType;

  @ApiProperty({
    description: 'Whether the question is required',
    example: true,
  })
  isRequired: boolean;

  @ApiProperty({
    description: 'The sort order of the question',
    example: 1,
  })
  sortOrder: number;

  @ApiProperty({
    description: 'The candidate answer',
    example: 'John Doe',
  })
  answer: string;
}

export class JobApplicationDetailsResponseDto {
  @ApiProperty({
    description: 'The ID of the job application',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The ID of the job',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  jobId: string;

  @ApiProperty({
    description: 'The ID of the candidate profile',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  candidateProfileId: string;

  @ApiProperty({
    description: 'The ID of the candidate CV',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  candidateCVId: string;

  @ApiProperty({
    description: 'The status of the job application',
    enum: JobApplicationStatus,
  })
  status: JobApplicationStatus;

  @ApiProperty({
    description: 'The created at date of the job application',
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at date of the job application',
    example: new Date(),
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The deleted at date of the job application (optional)',
    nullable: true,
  })
  deletedAt?: Date | null;

  @ApiProperty({
    description: 'The job (optional)',
    type: () => JobResponseWithoutQuestionsDto,
    required: false,
  })
  job?: JobResponseWithoutQuestionsDto;

  @ApiProperty({
    description: 'The candidate profile (optional)',
    type: () => CandidateResponseDto,
    required: false,
  })
  candidateProfile?: CandidateResponseDto;

  @ApiProperty({
    description: 'The candidate CV (optional)',
    type: () => CandidateCvResponseDto,
    required: false,
  })
  candidateCV?: CandidateCvResponseDto;

  @ApiProperty({
    description: 'Questions and answers for this application',
    type: [JobApplicationQuestionAnswerItemDto],
  })
  questionsAndAnswers: JobApplicationQuestionAnswerItemDto[];
}
