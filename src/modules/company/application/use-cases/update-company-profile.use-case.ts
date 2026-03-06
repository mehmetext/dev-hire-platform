import { Inject } from '@nestjs/common';
import { CompanyProfile } from '../../domain/entities/company-profile.entity';
import {
  CompanyProfileNotAllowedError,
  CompanyProfileNotFoundError,
} from '../../domain/errors';
import { UpdateCompanyProfileCommand } from '../dtos/update-company-profile.command';
import { CompanyRepository } from '../repositories/company.repository';

export class UpdateCompanyProfileUseCase {
  constructor(
    @Inject(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(command: UpdateCompanyProfileCommand): Promise<CompanyProfile> {
    const existing = await this.companyRepository.findById(command.id);

    if (!existing) {
      throw new CompanyProfileNotFoundError();
    }

    if (existing.userId !== command.userId) {
      throw new CompanyProfileNotAllowedError();
    }

    const updated = CompanyProfile.create({
      id: existing.id,
      userId: existing.userId,
      name: command.name ?? existing.name,
      logoUrl: command.logoUrl ?? existing.logoUrl,
      subscriptionPlan: existing.subscriptionPlan,
      createdAt: existing.createdAt,
      updatedAt: existing.updatedAt,
      deletedAt: existing.deletedAt,
    });

    return this.companyRepository.update(updated);
  }
}
