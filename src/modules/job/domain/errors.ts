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
