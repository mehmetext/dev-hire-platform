import { ApiProperty } from '@nestjs/swagger';
import { CandidateCvResponseDto } from 'src/modules/candidate/infra/dtos/candidate-cv-resposne.dto';
import { CandidateResponseDto } from 'src/modules/candidate/infra/dtos/candidate-response.dto';
import { JobApplicationStatus } from '../../domain/enums/job-application-status.enum';
import { JobResponseDto } from './job-response.dto';

export class JobApplicationResponseDto {
  @ApiProperty({
    description: 'The ID of the job',
    example: '123',
  })
  jobId: string;

  @ApiProperty({
    description: 'The ID of the candidate profile',
    example: '123',
  })
  candidateProfileId: string;

  @ApiProperty({
    description: 'The ID of the candidate CV',
    example: '123',
  })
  candidateCVId: string;

  @ApiProperty({
    description: 'The status of the job application',
    example: 'PENDING',
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
    example: new Date(),
    nullable: true,
  })
  deletedAt?: Date | null;

  @ApiProperty({
    description: 'The candidate profile of the job application',
    example: CandidateResponseDto,
  })
  candidateProfile?: CandidateResponseDto;

  @ApiProperty({
    description: 'The job of the job application',
    example: JobResponseDto,
  })
  job?: JobResponseDto;

  @ApiProperty({
    description: 'The candidate CV of the job application',
    example: CandidateCvResponseDto,
  })
  candidateCV?: CandidateCvResponseDto;
}
