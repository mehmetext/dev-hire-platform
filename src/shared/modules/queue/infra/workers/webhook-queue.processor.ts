import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { DispatchNewApplicationWebhookCommand } from 'src/modules/webhook/application/dtos/dispatch-new-application-webhook.command';
import { DispatchNewApplicationWebhookUseCase } from 'src/modules/webhook/application/use-cases/dispatch-new-application-webhook.use-case';

@Injectable()
@Processor('webhook-queue')
export class WebhookQueueProcessor extends WorkerHost {
  constructor(
    @Inject(DispatchNewApplicationWebhookUseCase)
    private readonly dispatchNewApplicationWebhookUseCase: DispatchNewApplicationWebhookUseCase,
  ) {
    super();
  }
  async process(job: Job<DispatchNewApplicationWebhookCommand, void, string>) {
    switch (job.name) {
      case 'dispatch-new-application-webhook':
        await this.dispatchNewApplicationWebhookUseCase.execute(job.data);
        break;
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  @OnWorkerEvent('failed')
  onFailed(
    job: Job<DispatchNewApplicationWebhookCommand, void, string>,
    error: Error,
  ) {
    console.error(`Job ${job.name} failed: ${error.message}`);
  }
}
