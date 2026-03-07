import { Inject } from '@nestjs/common';
import { CompanyWebhook } from '../../domain/entities/company-webhook.entity';
import { RegisterCompanyWebhookCommand } from '../dtos/register-company-webhook.command';
import { CompanyWebhookRepository } from '../repositories/company-webhook.repository';

export class RegisterCompanyWebhookUseCase {
  constructor(
    @Inject(CompanyWebhookRepository)
    private readonly companyWebhookRepository: CompanyWebhookRepository,
  ) {}

  async execute(
    command: RegisterCompanyWebhookCommand,
  ): Promise<CompanyWebhook> {
    return this.companyWebhookRepository.register(command);
  }
}
