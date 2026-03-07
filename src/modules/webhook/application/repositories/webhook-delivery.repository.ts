import { CreateWebhookDeliveryCommand } from '../dtos/create-webhook-delivery.command';

export abstract class WebhookDeliveryRepository {
  abstract create(command: CreateWebhookDeliveryCommand): Promise<void>;
}
