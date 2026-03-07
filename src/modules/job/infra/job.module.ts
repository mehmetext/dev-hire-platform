import { Module, forwardRef } from '@nestjs/common';
import { CandidateModule } from 'src/modules/candidate/infra/candidate.module';
import { SubscriptionModule } from 'src/modules/subscription/infra/subscription.module';
import { QueueModule } from 'src/shared/modules/queue/infra/queue.module';
import { JobRepository } from '../application/repositories/job.repository';
import { ApplyJobUseCase } from '../application/use-cases/apply-job.use-case';
import { CloseExpiredJobsUseCase } from '../application/use-cases/close-expired-jobs.use-case';
import { CreateJobUseCase } from '../application/use-cases/create-job.use-case';
import { DeleteJobUseCase } from '../application/use-cases/delete-job.use-case';
import { GetJobApplicationsByJobIdUseCase } from '../application/use-cases/get-job-applications-by-job-id-use-case';
import { GetJobByIdUseCase } from '../application/use-cases/get-job-by-id.use-case';
import { GetJobDetailsByIdUseCase } from '../application/use-cases/get-job-details-by-id.use-case';
import { GetJobsUseCase } from '../application/use-cases/get-jobs.use-case';
import { GetOwnedJobApplicationsUseCase } from '../application/use-cases/get-owned-job-applications.use-case';
import { GetOwnedJobsUseCase } from '../application/use-cases/get-owned-jobs.use-case';
import { UpdateJobApplicationStatusByCompanyUseCase } from '../application/use-cases/update-job-application-status-by-company.use-case';
import { UpdateJobUseCase } from '../application/use-cases/update-job.use-case';
import { WithdrawJobUseCase } from '../application/use-cases/withdraw-job.use-case';
import { PrismaJobRepository } from './db/prisma-job.repository';
import { JobController } from './http/job.controller';
import { CloseExpiredJobsCron } from './scheduler/close-expired-jobs.cron';

@Module({
  controllers: [JobController],
  imports: [CandidateModule, forwardRef(() => SubscriptionModule), QueueModule],
  providers: [
    {
      provide: JobRepository,
      useClass: PrismaJobRepository,
    },
    CloseExpiredJobsCron,
    CloseExpiredJobsUseCase,
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
    GetJobDetailsByIdUseCase,
  ],
  exports: [JobRepository],
})
export class JobModule {}
