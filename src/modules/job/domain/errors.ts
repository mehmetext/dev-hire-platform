import { DomainError } from 'src/shared/errors/domain.error';

export class JobNotFoundError extends DomainError {
  constructor(message = 'Job not found') {
    super(message, 'JOB_NOT_FOUND');
  }
}

export class JobNotAllowedError extends DomainError {
  constructor(message = 'You are not allowed to update this job') {
    super(message, 'JOB_NOT_ALLOWED');
  }
}

export class JobNotActiveError extends DomainError {
  constructor(message = 'Job is not active') {
    super(message, 'JOB_NOT_ACTIVE');
  }
}

export class JobExpiredError extends DomainError {
  constructor(message = 'Job has expired') {
    super(message, 'JOB_EXPIRED');
  }
}

export class JobAlreadyAppliedError extends DomainError {
  constructor(message = 'Job already applied') {
    super(message, 'JOB_ALREADY_APPLIED');
  }
}

export class JobApplicationNotFoundError extends DomainError {
  constructor(message = 'Job application not found') {
    super(message, 'JOB_APPLICATION_NOT_FOUND');
  }
}

export class JobApplicationNotPendingError extends DomainError {
  constructor(message = 'Job application is not in pending status') {
    super(message, 'JOB_APPLICATION_NOT_PENDING');
  }
}

export class MissingRequiredJobQuestionAnswerError extends DomainError {
  constructor(questionText: string) {
    super(
      `Required question has no answer: "${questionText}"`,
      'MISSING_REQUIRED_JOB_QUESTION_ANSWER',
    );
  }
}
export class InvalidJobQuestionAnswerError extends DomainError {
  constructor(questionText: string, reason: string) {
    super(
      `Invalid answer for question "${questionText}": ${reason}`,
      'INVALID_JOB_QUESTION_ANSWER',
    );
  }
}
