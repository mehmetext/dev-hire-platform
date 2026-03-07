import { Inject } from '@nestjs/common';
import { CompanyWebhook } from '../../domain/entities/company-webhook.entity';
import { CompanyWebhookRepository } from '../repositories/company-webhook.repository';

export class ListCompanyWebhooksUseCase {
  constructor(
    @Inject(CompanyWebhookRepository)
    private readonly companyWebhookRepository: CompanyWebhookRepository,
  ) {}

  async execute(companyProfileId: string): Promise<CompanyWebhook[]> {
    return this.companyWebhookRepository.findByCompanyProfileId(
      companyProfileId,
    );
  }
}
