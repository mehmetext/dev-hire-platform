import { Module } from '@nestjs/common';
import { CompanyRepository } from '../application/repositories/company.repository';
import { PrismaCompanyRepository } from './db/prisma-company.repository';

@Module({
  controllers: [],
  imports: [],
  providers: [
    {
      provide: CompanyRepository,
      useClass: PrismaCompanyRepository,
    },
  ],
  exports: [CompanyRepository],
})
export class CompanyModule {}
