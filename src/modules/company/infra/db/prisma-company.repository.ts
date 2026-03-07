import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { TransactionContext } from 'src/shared/modules/unit-of-work/application/repositories/unit-of-work.repository';
import { getPrismaClient } from 'src/shared/modules/unit-of-work/infra/get-prisma-client';
import { CompanyRepository } from '../../application/repositories/company.repository';
import { CompanyProfile } from '../../domain/entities/company-profile.entity';
import { PrismaCompanyMapper } from './prisma-company.mapper';

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    companyProfile: CompanyProfile,
    options?: { tx?: TransactionContext },
  ): Promise<CompanyProfile> {
    const client = getPrismaClient(options?.tx, this.prisma);

    const created = await client.companyProfile.create({
      data: PrismaCompanyMapper.toCreatePersistence(companyProfile),
    });

    return PrismaCompanyMapper.toDomain(created);
  }
  async findById(id: string): Promise<CompanyProfile | null> {
    const companyProfile = await this.prisma.companyProfile.findUnique({
      where: { id },
    });
    if (!companyProfile) return null;

    return PrismaCompanyMapper.toDomain(companyProfile);
  }
  async update(
    companyProfile: CompanyProfile,
    options?: { tx?: TransactionContext },
  ): Promise<CompanyProfile> {
    const client = getPrismaClient(options?.tx, this.prisma);

    const updated = await client.companyProfile.update({
      where: { id: companyProfile.id },
      data: PrismaCompanyMapper.toUpdatePersistence(companyProfile),
    });
    return PrismaCompanyMapper.toDomain(updated);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.companyProfile.delete({
      where: { id },
    });
  }
}
