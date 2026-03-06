import { StatusCode } from 'src/shared/constants/http-response-codes';
import { DomainError } from 'src/shared/errors/domain.error';

export class CompanyProfileNotFoundError extends DomainError {
  constructor(message = 'Company profile not found') {
    super(message, StatusCode.NOT_FOUND);
  }
}

export class CompanyProfileNotAllowedError extends DomainError {
  constructor(message = 'You are not allowed to update this company profile') {
    super(message, StatusCode.FORBIDDEN);
  }
}
