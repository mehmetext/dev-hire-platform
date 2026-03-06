import { StatusCode } from 'src/shared/constants/http-response-codes';
import { DomainError } from 'src/shared/errors/domain.error';

export class CandidateProfileNotFoundError extends DomainError {
  constructor(message = 'Candidate profile not found') {
    super(message, StatusCode.NOT_FOUND);
  }
}

export class CandidateProfileNotAllowedError extends DomainError {
  constructor(
    message = 'You are not allowed to update this candidate profile',
  ) {
    super(message, StatusCode.FORBIDDEN);
  }
}
