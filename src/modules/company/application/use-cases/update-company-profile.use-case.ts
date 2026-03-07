import { Inject } from '@nestjs/common';
import { GetPublicUrlUseCase } from 'src/modules/file-uploader/application/use-cases/get-public-url.use-case';
import { CompanyProfile } from '../../domain/entities/company-profile.entity';
import { CompanyProfileNotFoundError } from '../../domain/errors';
import { UpdateCompanyProfileCommand } from '../dtos/update-company-profile.command';
import { CompanyRepository } from '../repositories/company.repository';

export class UpdateCompanyProfileUseCase {
  constructor(
    @Inject(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
    @Inject(GetPublicUrlUseCase)
    private readonly getPublicUrlUseCase: GetPublicUrlUseCase,
  ) {}

  async execute(command: UpdateCompanyProfileCommand): Promise<CompanyProfile> {
    const existing = await this.companyRepository.findById(command.id);

    if (!existing) {
      throw new CompanyProfileNotFoundError();
    }

    existing.assertOwnedBy(command.userId);

    const logoUrl = command.logoUrl
      ? this.getPublicUrlUseCase.execute(command.logoUrl)
      : existing.logoUrl;

    const updated = CompanyProfile.create({
      id: existing.id,
      userId: existing.userId,
      name: command.name ?? existing.name,
      logoUrl,
      subscriptionPlan: existing.subscriptionPlan,
      createdAt: existing.createdAt,
      updatedAt: existing.updatedAt,
      deletedAt: existing.deletedAt,
    });

    return this.companyRepository.update(updated);
  }
}
