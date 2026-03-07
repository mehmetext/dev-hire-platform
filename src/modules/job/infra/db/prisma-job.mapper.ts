import {
  Prisma,
  CompanyProfile as PrismaCompanyProfile,
  Job as PrismaJob,
  JobQuestion as PrismaJobQuestion,
} from 'src/generated/prisma/client';
import { CompanyProfile } from 'src/modules/company/domain/entities/company-profile.entity';
import { JobQuestion } from '../../domain/entities/job-question.entity';
import { Job } from '../../domain/entities/job.entity';

export class PrismaJobMapper {
  static toDomain(
    job: PrismaJob & {
      companyProfile?: PrismaCompanyProfile;
      jobQuestions?: PrismaJobQuestion[];
    },
  ): Job {
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
      job.companyProfile
        ? CompanyProfile.create({
            id: job.companyProfile.id,
            name: job.companyProfile.name,
            logoUrl: job.companyProfile.logoUrl ?? undefined,
            userId: job.companyProfile.userId,
            subscriptionPlan: job.companyProfile.subscriptionPlan,
            createdAt: job.companyProfile.createdAt,
            updatedAt: job.companyProfile.updatedAt,
            deletedAt: job.companyProfile.deletedAt ?? undefined,
          })
        : undefined,
      job.jobQuestions?.map((jobQuestion) =>
        JobQuestion.create({
          id: jobQuestion.id,
          jobId: jobQuestion.jobId,
          question: jobQuestion.question,
          questionType: jobQuestion.questionType,
          isRequired: jobQuestion.isRequired,
          sortOrder: jobQuestion.sortOrder,
          createdAt: jobQuestion.createdAt,
          updatedAt: jobQuestion.updatedAt,
          deletedAt: jobQuestion.deletedAt ?? undefined,
        }),
      ),
    );
  }

  static toCreatePersistence(job: Job): Prisma.JobUncheckedCreateInput {
    return {
      companyProfileId: job.companyProfileId,
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      requirementsText: job.requirements.join('\n'),
      location: job.location,
      workType: job.workType,
      status: job.status,
      expiresAt: job.expiresAt ?? undefined,
    };
  }

  static toUpdatePersistence(job: Job): Prisma.JobUncheckedUpdateInput {
    return PrismaJobMapper.toCreatePersistence(job);
  }
}
