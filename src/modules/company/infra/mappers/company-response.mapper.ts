import { CompanyProfile } from '../../domain/entities/company-profile.entity';
import { CompanyResponseDto } from '../dtos/company-response.dto';

export class CompanyResponseMapper {
  static toDto(profile: CompanyProfile): CompanyResponseDto {
    return {
      id: profile.id,
      name: profile.name,
      logoUrl: profile.logoUrl,
      subscriptionPlan: profile.subscriptionPlan,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      deletedAt: profile.deletedAt ?? undefined,
    };
  }
}
