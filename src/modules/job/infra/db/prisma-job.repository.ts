import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from 'src/generated/prisma/client';
import { CandidateCV } from 'src/modules/candidate/domain/entities/candidate-cv.entity';
import { CandidateProfile } from 'src/modules/candidate/domain/entities/candidate-profile.entity';
import { CompanyProfile } from 'src/modules/company/domain/entities/company-profile.entity';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { ApplyJobCommand } from '../../application/dtos/apply-job.command';
import { CreateJobCommand } from '../../application/dtos/create-job.command';
import { GetJobsCommand } from '../../application/dtos/get-jobs.command';
import { GetOwnedJobApplicationsCommand } from '../../application/dtos/get-owned-job-applications.command';
import { UpdateJobApplicationStatusByCompanyCommand } from '../../application/dtos/update-job-application-status-by-company.command';
import { UpdateJobCommand } from '../../application/dtos/update-job.command';
import { WithdrawJobCommand } from '../../application/dtos/withdraw-job.command';
import { JobRepository } from '../../application/repositories/job.repository';
import { JobApplication } from '../../domain/entities/job-application.entity';
import { Job } from '../../domain/entities/job.entity';
import { JobStatus } from '../../domain/enums/job-status.enum';
import {
  JobAlreadyAppliedError,
  JobExpiredError,
  JobNotActiveError,
  JobNotFoundError,
} from '../../domain/errors';
import { PrismaJobMapper } from './prisma-job.mapper';

@Injectable()
export class PrismaJobRepository implements JobRepository {
  constructor(private readonly prisma: PrismaService) {}

  async apply(command: ApplyJobCommand): Promise<void> {
    const job = await this.findById(command.jobId);

    if (!job) {
      throw new JobNotFoundError();
    }

    if (job.status !== JobStatus.ACTIVE) {
      throw new JobNotActiveError();
    }

    if (job.expiresAt && job.expiresAt < new Date()) {
      throw new JobExpiredError();
    }

    const jobApplication =
      await this.findApplicationByJobIdAndCandidateProfileId(
        command.jobId,
        command.candidateProfileId,
      );

    if (jobApplication) {
      throw new JobAlreadyAppliedError();
    }

    await this.prisma.jobApplication.create({
      data: {
        jobId: command.jobId,
        candidateProfileId: command.candidateProfileId,
        candidateCVId: command.candidateCVId,
      },
    });
  }

  async withdraw(command: WithdrawJobCommand): Promise<void> {
    await this.prisma.jobApplication.delete({
      where: {
        jobId_candidateProfileId: {
          jobId: command.jobId,
          candidateProfileId: command.candidateProfileId,
        },
      },
    });
  }

  async findApplicationByJobIdAndCandidateProfileId(
    jobId: string,
    candidateProfileId: string,
  ): Promise<JobApplication | null> {
    const jobApplication = await this.prisma.jobApplication.findUnique({
      where: { jobId_candidateProfileId: { jobId, candidateProfileId } },
    });
    if (!jobApplication) return null;

    return JobApplication.create({
      jobId: jobApplication.jobId,
      candidateProfileId: jobApplication.candidateProfileId,
      candidateCVId: jobApplication.candidateCVId,
      status: jobApplication.status,
      createdAt: jobApplication.createdAt,
      updatedAt: jobApplication.updatedAt,
      deletedAt: jobApplication.deletedAt ?? undefined,
    });
  }

  async findAll(command: GetJobsCommand): Promise<Job[]> {
    const where: Prisma.JobWhereInput = {
      deletedAt: null,
      status: JobStatus.ACTIVE,
      OR: [
        {
          expiresAt: null,
        },
        {
          expiresAt: {
            gt: new Date(),
          },
        },
      ],
    };

    if (command.query) {
      where.title = {
        search: this.formatQuery(command.query),
      };
    }

    const jobs = await this.prisma.job.findMany({
      include: {
        companyProfile: true,
      },
      where,
    });

    return jobs.map((job) =>
      PrismaJobMapper.toDomain({
        ...job,
        companyProfile: job.companyProfile ?? undefined,
      }),
    );
  }

  formatQuery(query: string): string {
    return query.trim().split(/\s+/).filter(Boolean).join(' & ');
  }

  async findAllByCompanyId(companyId: string): Promise<Job[]> {
    const jobs = await this.prisma.job.findMany({
      where: {
        companyProfileId: companyId,
        deletedAt: null,
      },
    });
    return jobs.map((job) => PrismaJobMapper.toDomain(job));
  }

  async create(command: CreateJobCommand): Promise<Job> {
    const job = Job.create({
      id: randomUUID(),
      companyProfileId: command.companyProfileId,
      title: command.title,
      description: command.description,
      requirements: command.requirements,
      location: command.location,
      workType: command.workType,
      status: command.status,
      expiresAt: command.expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
    });

    const created = await this.prisma.job.create({
      data: PrismaJobMapper.toCreatePersistence(job),
    });

    return PrismaJobMapper.toDomain(created);
  }
  async findById(id: string): Promise<Job | null> {
    const job = await this.prisma.job.findUnique({
      where: { id },
    });
    if (!job) return null;

    return PrismaJobMapper.toDomain(job);
  }
  async update(command: UpdateJobCommand): Promise<Job> {
    const job = await this.findById(command.id);

    if (!job) {
      throw new JobNotFoundError();
    }

    const updatedJob = Job.create({
      ...job,
      ...command,
    });

    const updated = await this.prisma.job.update({
      where: { id: command.id },
      data: PrismaJobMapper.toUpdatePersistence(updatedJob),
    });
    return PrismaJobMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const job = await this.findById(id);

    if (!job) throw new JobNotFoundError();

    await this.prisma.job.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async countByCompanyId(companyId: string): Promise<number> {
    return this.prisma.job.count({
      where: { companyProfileId: companyId, deletedAt: null },
    });
  }

  async findAllJobApplicationsByJobId(
    jobId: string,
  ): Promise<JobApplication[]> {
    const jobApplications = await this.prisma.jobApplication.findMany({
      where: { jobId },
      include: {
        candidateProfile: true,
        candidateCV: true,
      },
    });

    return jobApplications.map((jobApplication) =>
      JobApplication.create({
        jobId: jobApplication.jobId,
        candidateProfileId: jobApplication.candidateProfileId,
        candidateCVId: jobApplication.candidateCVId,
        status: jobApplication.status,
        createdAt: jobApplication.createdAt,
        updatedAt: jobApplication.updatedAt,
        deletedAt: jobApplication.deletedAt ?? undefined,
        candidateProfile: jobApplication.candidateProfile
          ? CandidateProfile.create({
              id: jobApplication.candidateProfile.id,
              firstName: jobApplication.candidateProfile.firstName,
              lastName: jobApplication.candidateProfile.lastName,
              userId: jobApplication.candidateProfile.userId,
              createdAt: jobApplication.candidateProfile.createdAt,
              updatedAt: jobApplication.candidateProfile.updatedAt,
              deletedAt: jobApplication.candidateProfile.deletedAt ?? undefined,
            })
          : undefined,
        candidateCV: jobApplication.candidateCV
          ? CandidateCV.create({
              id: jobApplication.candidateCV.id,
              candidateProfileId: jobApplication.candidateCV.candidateProfileId,
              title: jobApplication.candidateCV.title ?? undefined,
              url: jobApplication.candidateCV.url,
              createdAt: jobApplication.candidateCV.createdAt,
              updatedAt: jobApplication.candidateCV.updatedAt,
              deletedAt: jobApplication.candidateCV.deletedAt ?? undefined,
            })
          : undefined,
      }),
    );
  }

  async findAllOwnedJobs(companyProfileId: string): Promise<Job[]> {
    const jobs = await this.prisma.job.findMany({
      where: { companyProfileId, deletedAt: null },
    });
    return jobs.map((job) => PrismaJobMapper.toDomain(job));
  }

  async updateJobApplicationStatusByCompany(
    command: UpdateJobApplicationStatusByCompanyCommand,
  ): Promise<void> {
    await this.prisma.jobApplication.update({
      where: {
        jobId_candidateProfileId: {
          jobId: command.jobId,
          candidateProfileId: command.candidateProfileId,
        },
      },
      data: { status: command.status },
    });
  }

  async findAllOwnedJobApplications(
    command: GetOwnedJobApplicationsCommand,
  ): Promise<JobApplication[]> {
    const jobApplications = await this.prisma.jobApplication.findMany({
      where: { candidateProfileId: command.candidateProfileId },
      include: {
        job: {
          include: {
            companyProfile: true,
          },
        },
        candidateCV: true,
      },
    });
    return jobApplications.map((jobApplication) =>
      JobApplication.create({
        jobId: jobApplication.jobId,
        candidateProfileId: jobApplication.candidateProfileId,
        candidateCVId: jobApplication.candidateCVId,
        status: jobApplication.status,
        createdAt: jobApplication.createdAt,
        updatedAt: jobApplication.updatedAt,
        deletedAt: jobApplication.deletedAt ?? undefined,
        job: jobApplication.job
          ? Job.create({
              id: jobApplication.job.id,
              companyProfileId: jobApplication.job.companyProfileId,
              title: jobApplication.job.title,
              description: jobApplication.job.description,
              requirements: jobApplication.job.requirements,
              location: jobApplication.job.location,
              workType: jobApplication.job.workType,
              status: jobApplication.job.status,
              expiresAt: jobApplication.job.expiresAt ?? undefined,
              createdAt: jobApplication.job.createdAt,
              updatedAt: jobApplication.job.updatedAt,
              deletedAt: jobApplication.job.deletedAt ?? undefined,
              companyProfile: jobApplication.job.companyProfile
                ? CompanyProfile.create({
                    id: jobApplication.job.companyProfile.id,
                    name: jobApplication.job.companyProfile.name,
                    logoUrl:
                      jobApplication.job.companyProfile.logoUrl ?? undefined,
                    userId: jobApplication.job.companyProfile.userId,
                    subscriptionPlan:
                      jobApplication.job.companyProfile.subscriptionPlan,
                    createdAt: jobApplication.job.companyProfile.createdAt,
                    updatedAt: jobApplication.job.companyProfile.updatedAt,
                    deletedAt:
                      jobApplication.job.companyProfile.deletedAt ?? undefined,
                  })
                : undefined,
            })
          : undefined,
        candidateCV: jobApplication.candidateCV
          ? CandidateCV.create({
              id: jobApplication.candidateCV.id,
              candidateProfileId: jobApplication.candidateCV.candidateProfileId,
              title: jobApplication.candidateCV.title ?? undefined,
              url: jobApplication.candidateCV.url,
              createdAt: jobApplication.candidateCV.createdAt,
              updatedAt: jobApplication.candidateCV.updatedAt,
              deletedAt: jobApplication.candidateCV.deletedAt ?? undefined,
            })
          : undefined,
      }),
    );
  }
}
