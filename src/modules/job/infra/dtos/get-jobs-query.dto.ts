import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WorkType } from '../../domain/enums/work-type.enum';

export class GetJobsQueryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The query to search for jobs',
    example: 'Software Engineering',
    required: false,
  })
  query?: string;

  @IsEnum(WorkType)
  @IsOptional()
  @ApiProperty({
    description: 'The work type of the job',
    example: WorkType.REMOTE,
    required: false,
    enum: WorkType,
  })
  workType?: WorkType;
}
