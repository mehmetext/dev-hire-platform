import { WebhookSenderResult } from '../dtos/webhook-sender.result';

export abstract class WebhookSenderRepository {
  abstract sendWebhook(
    url: string,
    payload: Record<string, unknown>,
  ): Promise<WebhookSenderResult>;
}
