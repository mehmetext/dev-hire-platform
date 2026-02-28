import {
  Prisma,
  CompanyProfile as PrismaCompanyProfile,
} from 'src/generated/prisma/client';
import { CompanyProfile } from '../../domain/entities/company-profile.entitiy';

export class PrismaCompanyMapper {
  static toDomain(companyProfile: PrismaCompanyProfile): CompanyProfile {
    return new CompanyProfile(
      companyProfile.id,
      companyProfile.name,
      companyProfile.logoUrl ?? undefined,
      companyProfile.userId,
      companyProfile.subscriptionPlan,
      companyProfile.createdAt,
      companyProfile.updatedAt,
      companyProfile.deletedAt ?? undefined,
    );
  }

  static toCreatePersistence(
    entity: CompanyProfile,
  ): Prisma.CompanyProfileUncheckedCreateInput {
    return {
      name: entity.name,
      logoUrl: entity.logoUrl,
      subscriptionPlan: entity.subscriptionPlan,
      userId: entity.userId,
    };
  }

  static toUpdatePersistence(
    entity: CompanyProfile,
  ): Prisma.CompanyProfileUncheckedUpdateInput {
    return {
      name: entity.name,
      logoUrl: entity.logoUrl,
      subscriptionPlan: entity.subscriptionPlan,
      userId: entity.userId,
      deletedAt: entity.deletedAt,
    };
  }
}
