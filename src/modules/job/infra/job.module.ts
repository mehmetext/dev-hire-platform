import { Module } from '@nestjs/common';
import { JobRepository } from '../application/repositories/job.repository';
import { CreateJobUseCase } from '../application/use-cases/create-job.use-case';
import { DeleteJobUseCase } from '../application/use-cases/delete-job.use-case';
import { GetJobByIdUseCase } from '../application/use-cases/get-job-by-id.use-case';
import { UpdateJobUseCase } from '../application/use-cases/update-job.use-case';
import { PrismaJobRepository } from './db/prisma-job.repository';
import { JobController } from './http/job.controller';

@Module({
  controllers: [JobController],
  imports: [],
  providers: [
    {
      provide: JobRepository,
      useClass: PrismaJobRepository,
    },
    CreateJobUseCase,
    UpdateJobUseCase,
    DeleteJobUseCase,
    GetJobByIdUseCase,
  ],
  exports: [JobRepository],
})
export class JobModule {}
