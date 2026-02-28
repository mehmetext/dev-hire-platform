import {
  CandidateProfile as PrismaCandidateProfile,
  CompanyProfile as PrismaCompanyProfile,
  User as PrismaUser,
} from 'src/generated/prisma/client';
import { CandidateProfile } from 'src/modules/candidate/domain/entities/candidate-profile.entity';
import { CompanyProfile } from 'src/modules/company/domain/entities/company-profile.entitiy';
import { User } from '../../domain/entities/user.entity';
import { EmailVO } from '../../domain/value-objects/email.vo';

export class PrismaUserMapper {
  static toDomain(
    user: PrismaUser & {
      companyProfile?: PrismaCompanyProfile;
      candidateProfile?: PrismaCandidateProfile;
    },
  ): User {
    return new User(
      user.id,
      new EmailVO(user.email),
      user.password,
      user.role,
      user.createdAt,
      user.updatedAt,
      user.deletedAt ?? undefined,
      user.companyProfile
        ? CompanyProfile.create({
            name: user.companyProfile.name,
            logoUrl: user.companyProfile.logoUrl ?? undefined,
            userId: user.companyProfile.userId,
            subscriptionPlan: user.companyProfile.subscriptionPlan,
            createdAt: user.companyProfile.createdAt,
            updatedAt: user.companyProfile.updatedAt,
            deletedAt: user.companyProfile.deletedAt ?? undefined,
          })
        : undefined,
      user.candidateProfile
        ? CandidateProfile.create({
            firstName: user.candidateProfile.firstName,
            lastName: user.candidateProfile.lastName,
            userId: user.candidateProfile.userId,
            createdAt: user.candidateProfile.createdAt,
            updatedAt: user.candidateProfile.updatedAt,
            deletedAt: user.candidateProfile.deletedAt ?? undefined,
          })
        : undefined,
    );
  }
}
