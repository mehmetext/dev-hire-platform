import { JobApplication } from '../../domain/entities/job-application.entity';
import { JobQuestion } from '../../domain/entities/job-question.entity';
import { Job } from '../../domain/entities/job.entity';

export interface ApplicationWithQuestionsAndAnswers {
  application: JobApplication;
  job: Job;
  questionAnswers: { question: JobQuestion; answer: string }[];
}
