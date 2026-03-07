import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CompanyWebhookNotFoundError } from '../../domain/errors';
import { DispatchNewApplicationWebhookCommand } from '../dtos/dispatch-new-application-webhook.command';
import { CompanyWebhookRepository } from '../repositories/company-webhook.repository';
@Injectable()
export class DispatchNewApplicationWebhookUseCase {
  constructor(
    @Inject(CompanyWebhookRepository)
    private readonly companyWebhookRepository: CompanyWebhookRepository,
    @Inject(HttpService)
    private readonly httpService: HttpService,
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

    if (!webhook.webhook) {
      throw new CompanyWebhookNotFoundError();
    }

    const response = await firstValueFrom(
      this.httpService.post(
        webhook.webhook.webhookUrl,
        {
          event: 'new_application',
          data: {
            jobId: command.jobId,
            candidateProfileId: command.candidateProfileId,
            candidateCVId: command.candidateCVId,
          },
        },
        {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    if (response.status >= 200 && response.status < 300) {
      return;
    }

    if (response.status >= 500) {
      throw new Error(
        `Webhook server error: ${response.status} ${response.statusText}`,
      );
    }
  }
}
