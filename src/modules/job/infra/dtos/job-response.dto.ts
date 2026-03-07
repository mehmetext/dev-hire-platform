import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CompanyResponseDto } from 'src/modules/company/infra/dtos/company-response.dto';
import { JobStatus } from '../../domain/enums/job-status.enum';
import { WorkType } from '../../domain/enums/work-type.enum';
import { JobQuestionResponseDto } from './job-question-response.dto';

export class JobResponseDto {
  @ApiProperty({
    description: 'The ID of the job',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The company profile ID of the job',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  companyProfileId: string;

  @ApiProperty({
    description: 'The title of the job',
    example: 'Software Engineer',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the job',
    example:
      'We are looking for a software engineer with 3 years of experience',
  })
  description: string;

  @ApiProperty({
    description: 'The requirements of the job',
    example: ['3 years of experience', "Bachelor's degree in Computer Science"],
  })
  requirements: string[];

  @ApiProperty({
    description: 'The location of the job',
    example: 'New York, NY',
  })
  location: string;

  @ApiProperty({
    description: 'The work type of the job',
    example: WorkType.REMOTE,
  })
  workType: WorkType;

  @ApiProperty({
    description: 'The status of the job',
    example: JobStatus.ACTIVE,
  })
  status: JobStatus;

  @ApiProperty({
    description: 'The expires at date of the job',
    example: new Date(),
  })
  expiresAt: Date | undefined;

  @ApiProperty({
    description: 'The created at date of the job',
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at date of the job',
    example: new Date(),
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The deleted at date of the job (optional)',
    example: new Date(),
    nullable: true,
  })
  deletedAt?: Date | null;

  @ApiProperty({
    description: 'The company profile of the job',
    example: CompanyResponseDto,
  })
  companyProfile?: CompanyResponseDto;

  @ApiProperty({
    description: 'The job questions of the job',
    type: () => [JobQuestionResponseDto],
  })
  jobQuestions?: JobQuestionResponseDto[];
}

export class JobResponseWithoutCompanyDto extends OmitType(JobResponseDto, [
  'companyProfile',
]) {}
