import { Module } from '@nestjs/common';
import { UnitOfWorkRepository } from './application/repositories/unit-of-work.repository';
import { PrismaUnitOfWorkRepository } from './infra/prisma-unit-of-work.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: UnitOfWorkRepository,
      useClass: PrismaUnitOfWorkRepository,
    },
  ],
  exports: [UnitOfWorkRepository],
})
export class UnitOfWorkModule {}
