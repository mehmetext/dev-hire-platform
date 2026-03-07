import { DispatchNewApplicationWebhookCommand } from '../../../../../modules/webhook/application/dtos/dispatch-new-application-webhook.command';

export abstract class WebhookDispatchRepository {
  abstract dispatchNewApplicationWebhook(
    command: Omit<
      DispatchNewApplicationWebhookCommand,
      'webhookId' | 'companyProfileId'
    >,
  ): Promise<void>;
}
