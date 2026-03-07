import { Inject } from '@nestjs/common';
import { CandidateRepository } from 'src/modules/candidate/application/repositories/candidate.repository';
import { EmailQueueRepository } from 'src/shared/modules/queue/application/repositories/email-queue.repository';
import { WebhookDispatchRepository } from 'src/shared/modules/queue/application/repositories/webhook-queue.repository';
import { CandidateCVNotFoundError } from '../../domain/errors';
import { ApplyJobCommand } from '../dtos/apply-job.command';
import { JobRepository } from '../repositories/job.repository';

export class ApplyJobUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
    @Inject(CandidateRepository)
    private readonly candidateRepository: CandidateRepository,
    @Inject(EmailQueueRepository)
    private readonly emailQueueRepository: EmailQueueRepository,
    @Inject(WebhookDispatchRepository)
    private readonly webhookQueueRepository: WebhookDispatchRepository,
  ) {}

  async execute(command: ApplyJobCommand): Promise<void> {
    const candidateCV = await this.candidateRepository.findCvById(
      command.candidateCVId,
    );

    if (!candidateCV) {
      throw new CandidateCVNotFoundError();
    }

    await this.jobRepository.apply(command);

    await this.emailQueueRepository.sendApplicationEmail({
      jobId: command.jobId,
      candidateProfileId: command.candidateProfileId,
      candidateCVUrl: candidateCV.url,
    });

    await this.webhookQueueRepository.dispatchNewApplicationWebhook({
      candidateProfileId: command.candidateProfileId,
      candidateCVId: command.candidateCVId,
      jobId: command.jobId,
    });
  }
}
