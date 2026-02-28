import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { CreateJobCommand } from '../../application/dtos/create-job.command';
import { UpdateJobCommand } from '../../application/dtos/update-job.command';
import { JobRepository } from '../../application/repositories/job.repository';
import { Job } from '../../domain/entities/job.entity';
import { JobNotFoundError } from '../../domain/errors';
import { PrismaJobMapper } from './prisma-job.mapper';

@Injectable()
export class PrismaJobRepository implements JobRepository {
  constructor(private readonly prisma: PrismaService) {}
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

    const updated = await this.prisma.job.update({
      where: { id: command.id },
      data: PrismaJobMapper.toUpdatePersistence(job),
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
}
