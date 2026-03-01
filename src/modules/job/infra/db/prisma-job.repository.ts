import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { ApplyJobCommand } from '../../application/dtos/apply-job.command';
import { CreateJobCommand } from '../../application/dtos/create-job.command';
import { UpdateJobCommand } from '../../application/dtos/update-job.command';
import { WithdrawJobCommand } from '../../application/dtos/withdraw-job.command';
import { JobRepository } from '../../application/repositories/job.repository';
import { Job } from '../../domain/entities/job.entity';
import { JobStatus } from '../../domain/enums/job-status.enum';
import {
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

    await this.prisma.jobApplication.create({
      data: {
        jobId: command.jobId,
        candidateProfileId: command.candidateProfileId,
        candidateCVId: command.candidateCVId,
      },
    });
  }

  async withdraw(command: WithdrawJobCommand): Promise<void> {
    const job = await this.findById(command.jobId);
    if (!job) {
      throw new JobNotFoundError();
    }
    await this.prisma.jobApplication.delete({
      where: {
        jobId_candidateProfileId: {
          jobId: command.jobId,
          candidateProfileId: command.candidateProfileId,
        },
      },
    });
  }

  async findAll(): Promise<Job[]> {
    const jobs = await this.prisma.job.findMany({
      include: {
        companyProfile: true,
      },
      where: {
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
      },
    });

    return jobs.map((job) =>
      PrismaJobMapper.toDomain({
        ...job,
        companyProfile: job.companyProfile ?? undefined,
      }),
    );
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
}
