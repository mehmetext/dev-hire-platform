import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobApplicationStatus } from '../../domain/enums/job-application-status.enum';

export class UpdateJobApplicationStatusByCompanyDto {
  @ApiProperty({
    description: 'The status of the job application',
    example: 'PENDING',
  })
  @IsEnum(JobApplicationStatus)
  @IsNotEmpty()
  status: JobApplicationStatus;
}
