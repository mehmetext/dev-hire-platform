import { Module } from '@nestjs/common';
import { CompanyRepository } from '../application/repositories/company.repository';
import { UpdateCompanyProfileUseCase } from '../application/use-cases/update-company-profile.use-case';
import { PrismaCompanyRepository } from './db/prisma-company.repository';
import { CompanyController } from './http/company.controller';

@Module({
  controllers: [CompanyController],
  imports: [],
  providers: [
    {
      provide: CompanyRepository,
      useClass: PrismaCompanyRepository,
    },
    UpdateCompanyProfileUseCase,
  ],
  exports: [CompanyRepository],
})
export class CompanyModule {}
