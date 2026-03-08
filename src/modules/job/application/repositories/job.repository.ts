import { Injectable } from '@nestjs/common';
import { JobApplication } from '../../domain/entities/job-application.entity';
import { JobQuestion } from '../../domain/entities/job-question.entity';
import { Job } from '../../domain/entities/job.entity';
import { ApplicationWithQuestionsAndAnswers } from '../dtos/application-with-questions-and-answers';
import { BulkUpdateJobQuestionItemCommand } from '../dtos/bulk-update-job-questions.command';
import { CreateJobQuestionAnswerCommand } from '../dtos/create-job-question-answer.command';
import { CreateJobQuestionCommand } from '../dtos/create-job-question.command';
import { CreateJobCommand } from '../dtos/create-job.command';
import { GetJobsCommand } from '../dtos/get-jobs.command';
import { GetOwnedJobApplicationsCommand } from '../dtos/get-owned-job-applications.command';
import { UpdateJobApplicationStatusByCompanyCommand } from '../dtos/update-job-application-status-by-company.command';
import { UpdateJobCommand } from '../dtos/update-job.command';
import { WithdrawJobCommand } from '../dtos/withdraw-job.command';

@Injectable()
export abstract class JobRepository {
  abstract addApplication(params: {
    jobId: string;
    candidateProfileId: string;
    candidateCVId: string;
    jobQuestionAnswers: CreateJobQuestionAnswerCommand[];
  }): Promise<void>;
  abstract withdraw(command: WithdrawJobCommand): Promise<void>;
  abstract findApplicationByJobIdAndCandidateProfileId(
    jobId: string,
    candidateProfileId: string,
  ): Promise<JobApplication | null>;
  abstract findApplicationById(id: string): Promise<JobApplication | null>;
  abstract findApplicationByIdWithQuestionsAndAnswers(
    applicationId: string,
  ): Promise<ApplicationWithQuestionsAndAnswers | null>;
  abstract findAllJobApplicationsByJobId(
    jobId: string,
  ): Promise<JobApplication[]>;
  abstract create(command: CreateJobCommand): Promise<Job>;
  abstract findAll(command: GetJobsCommand): Promise<Job[]>;
  abstract findById(
    id: string,
    params?: { includeJobQuestions?: boolean },
  ): Promise<Job | null>;
  abstract findAllByCompanyId(companyId: string): Promise<Job[]>;
  abstract update(command: UpdateJobCommand): Promise<Job>;
  abstract delete(id: string): Promise<void>;
  abstract countByCompanyId(companyId: string): Promise<number>;
  abstract findAllOwnedJobs(companyProfileId: string): Promise<Job[]>;
  abstract updateJobApplicationStatusByCompany(
    command: UpdateJobApplicationStatusByCompanyCommand,
  ): Promise<void>;
  abstract findAllOwnedJobApplications(
    command: GetOwnedJobApplicationsCommand,
  ): Promise<JobApplication[]>;
  abstract closeExpiredJobs(): Promise<void>;
  abstract addQuestions(
    jobId: string,
    questions: CreateJobQuestionCommand[],
  ): Promise<JobQuestion[]>;
  abstract updateQuestions(
    jobId: string,
    updates: BulkUpdateJobQuestionItemCommand[],
  ): Promise<JobQuestion[]>;
  abstract deleteQuestions(jobId: string, questionIds: string[]): Promise<void>;
  abstract deleteQuestionAnswersByJobApplicationId(
    jobApplicationId: string,
  ): Promise<void>;
}
