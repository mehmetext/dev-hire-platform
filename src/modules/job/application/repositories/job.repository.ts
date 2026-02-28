import { Injectable } from '@nestjs/common';
import { Job } from '../../domain/entities/job.entity';
import { CreateJobCommand } from '../dtos/create-job.command';
import { UpdateJobCommand } from '../dtos/update-job.command';

@Injectable()
export abstract class JobRepository {
  abstract create(command: CreateJobCommand): Promise<Job>;
  abstract findAll(): Promise<Job[]>;
  abstract findById(id: string): Promise<Job | null>;
  abstract findAllByCompanyId(companyId: string): Promise<Job[]>;
  abstract update(command: UpdateJobCommand): Promise<Job>;
  abstract delete(id: string): Promise<void>;
  abstract countByCompanyId(companyId: string): Promise<number>;
}
