import { Injectable } from '@nestjs/common';
import { JobApplication } from '../../domain/entities/job-application.entity';
import { Job } from '../../domain/entities/job.entity';
import { ApplyJobCommand } from '../dtos/apply-job.command';
import { CreateJobCommand } from '../dtos/create-job.command';
import { UpdateJobCommand } from '../dtos/update-job.command';
import { WithdrawJobCommand } from '../dtos/withdraw-job.command';

@Injectable()
export abstract class JobRepository {
  abstract apply(command: ApplyJobCommand): Promise<void>;
  abstract withdraw(command: WithdrawJobCommand): Promise<void>;
  abstract findApplicationByJobIdAndCandidateProfileId(
    jobId: string,
    candidateProfileId: string,
  ): Promise<JobApplication | null>;
  abstract findAllJobApplicationsByJobId(
    jobId: string,
  ): Promise<JobApplication[]>;
  abstract create(command: CreateJobCommand): Promise<Job>;
  abstract findAll(): Promise<Job[]>;
  abstract findById(id: string): Promise<Job | null>;
  abstract findAllByCompanyId(companyId: string): Promise<Job[]>;
  abstract update(command: UpdateJobCommand): Promise<Job>;
  abstract delete(id: string): Promise<void>;
  abstract countByCompanyId(companyId: string): Promise<number>;
}
