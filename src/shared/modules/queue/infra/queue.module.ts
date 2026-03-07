import { BullModule } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobModule } from 'src/modules/job/infra/job.module';
import { WebhookModule } from 'src/modules/webhook/infra/webhook.module';
import { MailModule } from '../../mail/infra/mail.module';
import { EmailQueueRepository } from '../application/repositories/email-queue.repository';
import { WebhookDispatchRepository } from '../application/repositories/webhook-queue.repository';
import { BullmqEmailQueueRepository } from './queue/bullmq-email-queue.repository';
import { BullmqWebhookQueueRepository } from './queue/bullmq-webhook-queue.repository';
import { EmailQueueProcessor } from './workers/email-queue.processor';
import { WebhookQueueProcessor } from './workers/webhook-queue.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          url: configService.getOrThrow<string>('REDIS_URL'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'email-queue',
    }),
    BullModule.registerQueue({
      name: 'webhook-queue',
    }),
    MailModule,
    WebhookModule,
    forwardRef(() => JobModule),
  ],
  providers: [
    {
      provide: EmailQueueRepository,
      useClass: BullmqEmailQueueRepository,
    },
    {
      provide: WebhookDispatchRepository,
      useClass: BullmqWebhookQueueRepository,
    },
    EmailQueueProcessor,
    WebhookQueueProcessor,
  ],
  exports: [EmailQueueRepository, WebhookDispatchRepository],
})
export class QueueModule {}
