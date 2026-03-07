import { Inject, Injectable } from '@nestjs/common';
import { CompanyWebhookNotFoundError } from '../../domain/errors';
import { DispatchNewApplicationWebhookCommand } from '../dtos/dispatch-new-application-webhook.command';
import { CompanyWebhookRepository } from '../repositories/company-webhook.repository';
@Injectable()
export class DispatchNewApplicationWebhookUseCase {
  constructor(
    @Inject(CompanyWebhookRepository)
    private readonly companyWebhookRepository: CompanyWebhookRepository,
  ) {}

  async execute(command: DispatchNewApplicationWebhookCommand): Promise<void> {
    const webhook =
      await this.companyWebhookRepository.findByWebhookIdAndCompanyProfileId(
        command.webhookId,
        command.companyProfileId,
      );
    if (!webhook) {
      throw new CompanyWebhookNotFoundError();
    }
    console.log('webhook', webhook);
    return Promise.resolve();
  }
}
