import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { CreateWebhookDeliveryCommand } from '../../application/dtos/create-webhook-delivery.command';
import { WebhookDeliveryRepository } from '../../application/repositories/webhook-delivery.repository';

@Injectable()
export class PrismaWebhookDeliveryRepository implements WebhookDeliveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(command: CreateWebhookDeliveryCommand): Promise<void> {
    await this.prisma.webhookDelivery.create({
      data: {
        webhookId: command.webhookId,
        eventType: command.eventType,
        payload: command.payload as object,
        status: command.status,
        nextRetryAt: command.nextRetryAt ?? undefined,
      },
    });
  }
}
