import { Inject } from '@nestjs/common';
import { JobApplicationNotFoundError } from '../../domain/errors';
import { ApplicationWithQuestionsAndAnswers } from '../dtos/application-with-questions-and-answers';
import { GetApplicationDetailsByIdCommand } from '../dtos/get-application-details-by-id.command';
import { JobRepository } from '../repositories/job.repository';

export class GetApplicationDetailsByIdUseCase {
  constructor(
    @Inject(JobRepository)
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(
    command: GetApplicationDetailsByIdCommand,
  ): Promise<ApplicationWithQuestionsAndAnswers> {
    const result =
      await this.jobRepository.findApplicationByIdWithQuestionsAndAnswers(
        command.applicationId,
      );

    if (!result) {
      throw new JobApplicationNotFoundError();
    }

    const { application, job } = result;
    const isCompanyOwner =
      command.companyProfileId &&
      job.companyProfileId === command.companyProfileId;
    const isCandidateOwner =
      command.candidateProfileId &&
      application.candidateProfileId === command.candidateProfileId;

    if (!isCompanyOwner && !isCandidateOwner) {
      throw new JobApplicationNotFoundError();
    }

    return result;
  }
}
