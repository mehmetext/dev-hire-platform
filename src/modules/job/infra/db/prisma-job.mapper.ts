import { Prisma, Job as PrismaJob } from 'src/generated/prisma/client';
import { Job } from '../../domain/entities/job.entity';

export class PrismaJobMapper {
  static toDomain(job: PrismaJob): Job {
    return new Job(
      job.id,
      job.companyProfileId,
      job.title,
      job.description,
      job.requirements,
      job.location,
      job.workType,
      job.status,
      job.expiresAt ?? undefined,
      job.createdAt,
      job.updatedAt,
      job.deletedAt ?? undefined,
    );
  }

  static toCreatePersistence(job: Job): Prisma.JobUncheckedCreateInput {
    return {
      companyProfileId: job.companyProfileId,
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      workType: job.workType,
      status: job.status,
      expiresAt: job.expiresAt ?? undefined,
    };
  }

  static toUpdatePersistence(job: Job): Prisma.JobUncheckedUpdateInput {
    return {
      ...PrismaJobMapper.toCreatePersistence(job),
      deletedAt: job.deletedAt ?? undefined,
    };
  }
}
