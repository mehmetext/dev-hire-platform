import { Inject, Injectable } from '@nestjs/common';
import { WebhookDeliveryStatus } from '../../domain/enums/webhook-delivery-status.enum';
import { CompanyWebhookNotFoundError } from '../../domain/errors';
import { CreateWebhookDeliveryCommand } from '../dtos/create-webhook-delivery.command';
import { DispatchNewApplicationWebhookCommand } from '../dtos/dispatch-new-application-webhook.command';
import { CompanyWebhookRepository } from '../repositories/company-webhook.repository';
import { WebhookDeliveryRepository } from '../repositories/webhook-delivery.repository';
import { WebhookSenderRepository } from '../repositories/webhook-sender.repository';

@Injectable()
export class DispatchNewApplicationWebhookUseCase {
  private readonly EVENT_TYPE = 'new_application';

  constructor(
    @Inject(CompanyWebhookRepository)
    private readonly companyWebhookRepository: CompanyWebhookRepository,
    @Inject(WebhookDeliveryRepository)
    private readonly webhookDeliveryRepository: WebhookDeliveryRepository,
    @Inject(WebhookSenderRepository)
    private readonly webhookSenderRepository: WebhookSenderRepository,
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

    const payload = {
      event: this.EVENT_TYPE,
      data: {
        jobId: command.jobId,
        candidateProfileId: command.candidateProfileId,
        candidateCVId: command.candidateCVId,
      },
    };

    try {
      const response = await this.webhookSenderRepository.sendWebhook(
        webhook.webhook.webhookUrl,
        payload,
      );

      if (response.status >= 200 && response.status < 300) {
        await this.recordDelivery(webhook.webhookId, payload, 'SUCCESS');
        return;
      }

      if (response.status >= 500) {
        await this.recordDelivery(webhook.webhookId, payload, 'RETRYING', {
          nextRetryAt: new Date(Date.now() + 60_000),
        });
        throw new Error(
          `Webhook server error: ${response.status} ${response.statusText}`,
        );
      }

      await this.recordDelivery(webhook.webhookId, payload, 'FAILED');
    } catch (error) {
      await this.recordDelivery(webhook.webhookId, payload, 'FAILED');
      throw error;
    }
  }

  private async recordDelivery(
    webhookId: string,
    payload: Record<string, unknown>,
    status: WebhookDeliveryStatus,
    options?: { nextRetryAt?: Date },
  ): Promise<void> {
    await this.webhookDeliveryRepository.create(
      new CreateWebhookDeliveryCommand(
        webhookId,
        this.EVENT_TYPE,
        payload,
        status,
        options?.nextRetryAt ?? null,
      ),
    );
  }
}
