import { CompanyResponseMapper } from 'src/modules/company/infra/mappers/company-response.mapper';
import { Job } from '../../domain/entities/job.entity';
import { JobResponseWithoutQuestionsDto } from '../dtos/job-response.dto';

export class JobResponseMapper {
  static toResponseWithoutQuestions(job: Job): JobResponseWithoutQuestionsDto {
    return {
      id: job.id,
      companyProfileId: job.companyProfileId,
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      workType: job.workType,
      status: job.status,
      expiresAt: job.expiresAt,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      deletedAt: job.deletedAt ?? undefined,
      companyProfile: job.companyProfile
        ? CompanyResponseMapper.toDto(job.companyProfile)
        : undefined,
    };
  }
}
