import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { SendApplicationEmailCommand } from 'src/shared/modules/mail/application/dtos/send-application-email.command';
import { SendApplicationEmailUseCase } from 'src/shared/modules/mail/application/use-cases/send-application-email.use-case';

@Injectable()
@Processor('email-queue')
export class EmailQueueProcessor extends WorkerHost {
  constructor(
    @Inject(SendApplicationEmailUseCase)
    private readonly sendApplicationEmailUseCase: SendApplicationEmailUseCase,
  ) {
    super();
  }

  async process(job: Job<SendApplicationEmailCommand, void, string>) {
    switch (job.name) {
      case 'send-application-email':
        await this.sendApplicationEmailUseCase.execute(job.data);
        break;
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<SendApplicationEmailCommand, void, string>, error: Error) {
    console.error(`Job ${job.name} failed: ${error.message}`);
  }
}
