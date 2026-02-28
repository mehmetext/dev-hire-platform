import { Module } from '@nestjs/common';
import { CandidateModule } from 'src/modules/candidate/infra/candidate.module';
import { CompanyModule } from 'src/modules/company/infra/company.module';
import { UnitOfWorkModule } from 'src/shared/modules/unit-of-work/unit-of-work.module';
import { UserRepository } from '../application/repositories/user.repository';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { PrismaUserRepository } from './db/prisma-user.repository';

@Module({
  controllers: [],
  imports: [CompanyModule, CandidateModule, UnitOfWorkModule],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    CreateUserUseCase,
  ],
  exports: [UserRepository, CreateUserUseCase],
})
export class UserModule {}
