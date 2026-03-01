import { StatusCode } from 'src/shared/constants/http-response-codes';
import { DomainError } from 'src/shared/errors/domain.error';

export class JobNotFoundError extends DomainError {
  constructor(message = 'Job not found') {
    super(message, StatusCode.NOT_FOUND);
  }
}

export class JobNotAllowedError extends DomainError {
  constructor(message = 'You are not allowed to update this job') {
    super(message, StatusCode.FORBIDDEN);
  }
}

export class JobNotActiveError extends DomainError {
  constructor(message = 'Job is not active') {
    super(message, StatusCode.BAD_REQUEST);
  }
}

export class JobExpiredError extends DomainError {
  constructor(message = 'Job has expired') {
    super(message, StatusCode.BAD_REQUEST);
  }
}

export class CandidateCVNotFoundError extends DomainError {
  constructor(message = 'Candidate CV not found') {
    super(message, StatusCode.NOT_FOUND);
  }
}

export class JobAlreadyAppliedError extends DomainError {
  constructor(message = 'Job already applied') {
    super(message, StatusCode.BAD_REQUEST);
  }
}

export class JobApplicationNotFoundError extends DomainError {
  constructor(message = 'Job application not found') {
    super(message, StatusCode.NOT_FOUND);
  }
}

export class JobApplicationNotPendingError extends DomainError {
  constructor(message = 'Job application is not in pending status') {
    super(message, StatusCode.BAD_REQUEST);
  }
}
