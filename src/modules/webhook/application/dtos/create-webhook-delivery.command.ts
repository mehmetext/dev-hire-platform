import { WebhookDeliveryStatus } from '../../domain/enums/webhook-delivery-status.enum';

export class CreateWebhookDeliveryCommand {
  constructor(
    public readonly webhookId: string,
    public readonly eventType: string,
    public readonly payload: Record<string, unknown>,
    public readonly status: WebhookDeliveryStatus,
    public readonly nextRetryAt?: Date | null,
  ) {}
}
