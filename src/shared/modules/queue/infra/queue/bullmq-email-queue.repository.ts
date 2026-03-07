import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { SendApplicationEmailCommand } from 'src/shared/modules/mail/application/dtos/send-application-email.command';
import { EmailQueueRepository } from '../../application/repositories/email-queue.repository';

@Injectable()
export class BullmqEmailQueueRepository implements EmailQueueRepository {
  constructor(@InjectQueue('email-queue') private readonly emailQueue: Queue) {}

  async sendApplicationEmail(
    command: SendApplicationEmailCommand,
  ): Promise<void> {
    await this.emailQueue.add('send-application-email', command, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
    });
  }
}
