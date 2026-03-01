import { Module } from '@nestjs/common';
import { CandidateModule } from 'src/modules/candidate/infra/candidate.module';
import { JobRepository } from '../application/repositories/job.repository';
import { ApplyJobUseCase } from '../application/use-cases/apply-job.use-case';
import { CreateJobUseCase } from '../application/use-cases/create-job.use-case';
import { DeleteJobUseCase } from '../application/use-cases/delete-job.use-case';
import { GetJobApplicationsByJobIdUseCase } from '../application/use-cases/get-job-applications-by-job-id-use-case';
import { GetJobByIdUseCase } from '../application/use-cases/get-job-by-id.use-case';
import { GetJobsUseCase } from '../application/use-cases/get-jobs.use-case';
import { GetOwnedJobApplicationsUseCase } from '../application/use-cases/get-owned-job-applications.use-case';
import { GetOwnedJobsUseCase } from '../application/use-cases/get-owned-jobs.use-case';
import { UpdateJobApplicationStatusByCompanyUseCase } from '../application/use-cases/update-job-application-status-by-company.use-case';
import { UpdateJobUseCase } from '../application/use-cases/update-job.use-case';
import { WithdrawJobUseCase } from '../application/use-cases/withdraw-job.use-case';
import { PrismaJobRepository } from './db/prisma-job.repository';
import { JobController } from './http/job.controller';

@Module({
  controllers: [JobController],
  imports: [CandidateModule],
  providers: [
    {
      provide: JobRepository,
      useClass: PrismaJobRepository,
    },
    CreateJobUseCase,
    UpdateJobUseCase,
    DeleteJobUseCase,
    GetJobByIdUseCase,
    GetJobsUseCase,
    GetOwnedJobsUseCase,
    ApplyJobUseCase,
    WithdrawJobUseCase,
    GetJobApplicationsByJobIdUseCase,
    UpdateJobApplicationStatusByCompanyUseCase,
    GetOwnedJobApplicationsUseCase,
  ],
  exports: [JobRepository],
})
export class JobModule {}
