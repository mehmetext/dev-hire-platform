import { CandidateResponseMapper } from 'src/modules/candidate/infra/mappers/candidate-response.mapper';
import { ApplicationWithQuestionsAndAnswers } from '../../application/dtos/application-with-questions-and-answers';
import {
  JobApplicationDetailsResponseDto,
  JobApplicationQuestionAnswerItemDto,
} from '../dtos/job-application-details-response.dto';
import { JobResponseMapper } from './job-response.mapper';

export class JobApplicationDetailsMapper {
  static toResponseDto(
    result: ApplicationWithQuestionsAndAnswers,
  ): JobApplicationDetailsResponseDto {
    const { application, job, questionAnswers } = result;

    const questionsAndAnswers: JobApplicationQuestionAnswerItemDto[] =
      questionAnswers.map(({ question, answer }) => ({
        questionId: question.id,
        question: question.question,
        questionType: question.questionType,
        isRequired: question.isRequired,
        sortOrder: question.sortOrder,
        answer,
      }));

    return {
      id: application.id,
      jobId: application.jobId,
      candidateProfileId: application.candidateProfileId,
      candidateCVId: application.candidateCVId,
      status: application.status,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      deletedAt: application.deletedAt ?? undefined,
      job: JobResponseMapper.toResponseWithoutQuestions(job),
      candidateProfile: application.candidateProfile
        ? CandidateResponseMapper.toProfileDto(application.candidateProfile)
        : undefined,
      candidateCV: application.candidateCV
        ? CandidateResponseMapper.toCvDto(application.candidateCV)
        : undefined,
      questionsAndAnswers,
    };
  }
}
