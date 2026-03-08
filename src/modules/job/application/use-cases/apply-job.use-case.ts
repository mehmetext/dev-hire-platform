import { Inject } from '@nestjs/common';
import { CandidateRepository } from 'src/modules/candidate/application/repositories/candidate.repository';
import { CandidateCVNotFoundError } from 'src/modules/candidate/domain/errors';
import { EmailQueueRepository } from 'src/shared/modules/queue/application/repositories/email-queue.repository';
import { WebhookDispatchRepository } from 'src/shared/modules/queue/application/repositories/webhook-queue.repository';
import { JobAlreadyAppliedError, JobNotFoundError } from '../../domain/errors';
import { JobApplicationAnswersValidator } from '../../domain/services/job-application-answers.validator';
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

    const job = await this.jobRepository.findById(command.jobId, {
      includeJobQuestions: true,
    });

    if (!job) {
      throw new JobNotFoundError();
    }

    job.assertCanAcceptApplication();

    const existingApplication =
      await this.jobRepository.findApplicationByJobIdAndCandidateProfileId(
        command.jobId,
        command.candidateProfileId,
      );

    if (existingApplication) {
      throw new JobAlreadyAppliedError();
    }

    JobApplicationAnswersValidator.validate(
      job.jobQuestions ?? [],
      command.jobQuestionAnswers,
    );

    await this.jobRepository.addApplication(command);

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
