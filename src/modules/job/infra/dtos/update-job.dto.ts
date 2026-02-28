import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { JobStatus } from '../../domain/enums/job-status.enum';
import { WorkType } from '../../domain/enums/work-type.enum';

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The title of the job',
    example: 'Software Engineer',
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The description of the job',
    example:
      'We are looking for a software engineer with 3 years of experience',
  })
  description: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'The requirements of the job',
    example: ['3 years of experience', "Bachelor's degree in Computer Science"],
  })
  requirements: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The location of the job',
    example: 'New York, NY',
  })
  location: string;

  @IsEnum(WorkType)
  @IsOptional()
  @ApiProperty({
    description: 'The work type of the job',
    example: WorkType.REMOTE,
  })
  workType: WorkType;

  @IsEnum(JobStatus)
  @IsOptional()
  @ApiProperty({
    description: 'The status of the job',
    example: JobStatus.ACTIVE,
  })
  status: JobStatus;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'The expires at date of the job',
    example: new Date(),
  })
  expiresAt: Date;
}
