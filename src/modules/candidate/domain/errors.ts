import { DomainError } from 'src/shared/errors/domain.error';

export class CandidateProfileNotFoundError extends DomainError {
  constructor(message = 'Candidate profile not found') {
    super(message, 'CANDIDATE_PROFILE_NOT_FOUND');
  }
}

export class CandidateProfileNotAllowedError extends DomainError {
  constructor(
    message = 'You are not allowed to update this candidate profile',
  ) {
    super(message, 'CANDIDATE_PROFILE_NOT_ALLOWED');
  }
}

export class CandidateCvNotAllowedError extends DomainError {
  constructor(message = 'You are not allowed to update this CV') {
    super(message, 'CANDIDATE_CV_NOT_ALLOWED');
  }
}

export class CandidateCVNotFoundError extends DomainError {
  constructor(message = 'Candidate CV not found') {
    super(message, 'CANDIDATE_CV_NOT_FOUND');
  }
}
