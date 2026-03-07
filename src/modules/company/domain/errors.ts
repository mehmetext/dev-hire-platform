import { DomainError } from 'src/shared/errors/domain.error';

export class CompanyProfileNotFoundError extends DomainError {
  constructor(message = 'Company profile not found') {
    super(message, 'COMPANY_PROFILE_NOT_FOUND');
  }
}

export class CompanyProfileNotAllowedError extends DomainError {
  constructor(message = 'You are not allowed to update this company profile') {
    super(message, 'COMPANY_PROFILE_NOT_ALLOWED');
  }
}

export class CompanyProfileAlreadyUpgradedError extends DomainError {
  constructor(message = 'Company profile already upgraded') {
    super(message, 'COMPANY_PROFILE_ALREADY_UPGRADED');
  }
}
