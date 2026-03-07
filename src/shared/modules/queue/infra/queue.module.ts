import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from '../../mail/infra/mail.module';
import { EmailQueueRepository } from '../application/repositories/email-queue.repository';
import { BullmqEmailQueueRepository } from './queue/bullmq-email-queue.repository';
import { EmailQueueProcessor } from './workers/email-queue.processor';

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
    MailModule,
  ],
  providers: [
    {
      provide: EmailQueueRepository,
      useClass: BullmqEmailQueueRepository,
    },
    EmailQueueProcessor,
  ],
  exports: [EmailQueueRepository],
})
export class QueueModule {}
