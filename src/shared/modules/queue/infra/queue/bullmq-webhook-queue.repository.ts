import { InjectQueue } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Queue } from 'bullmq';
import { JobRepository } from 'src/modules/job/application/repositories/job.repository';
import { JobNotFoundError } from 'src/modules/job/domain/errors';
import { DispatchNewApplicationWebhookCommand } from 'src/modules/webhook/application/dtos/dispatch-new-application-webhook.command';
import { CompanyWebhookRepository } from 'src/modules/webhook/application/repositories/company-webhook.repository';
import { WebhookDispatchRepository } from '../../application/repositories/webhook-queue.repository';

export class BullmqWebhookQueueRepository implements WebhookDispatchRepository {
  constructor(
    @InjectQueue('webhook-queue') private readonly webhookQueue: Queue,
    @Inject(CompanyWebhookRepository)
    private readonly companyWebhookRepository: CompanyWebhookRepository,
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async dispatchNewApplicationWebhook(
    command: Omit<
      DispatchNewApplicationWebhookCommand,
      'webhookId' | 'companyProfileId'
    >,
  ): Promise<void> {
    const job = await this.jobRepository.findById(command.jobId);

    if (!job) {
      throw new JobNotFoundError();
    }

    const webhooks = await this.companyWebhookRepository.findByCompanyProfileId(
      job.companyProfileId,
    );

    for (const webhook of webhooks) {
      await this.webhookQueue.add(
        'dispatch-new-application-webhook',
        {
          webhookId: webhook.webhookId,
          jobId: command.jobId,
          candidateProfileId: command.candidateProfileId,
          candidateCVId: command.candidateCVId,
          companyProfileId: job.companyProfileId,
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
        },
      );
    }
  }
}
