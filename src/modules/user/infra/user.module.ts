import { Module } from '@nestjs/common';
import { CandidateModule } from 'src/modules/candidate/infra/candidate.module';
import { CompanyModule } from 'src/modules/company/infra/company.module';
import { UnitOfWorkRepository } from 'src/shared/modules/unit-of-work/application/repositories/unit-of-work.repository';
import { PrismaUnitOfWorkRepository } from 'src/shared/modules/unit-of-work/infra/prisma-unit-of-work.repository';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { UserRepository } from '../domain/repositories/user.repository';
import { PrismaUserRepository } from './db/prisma-user.repository';

@Module({
  controllers: [],
  imports: [CompanyModule, CandidateModule],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: UnitOfWorkRepository,
      useClass: PrismaUnitOfWorkRepository,
    },
    CreateUserUseCase,
  ],
  exports: [UserRepository, CreateUserUseCase],
})
export class UserModule {}
