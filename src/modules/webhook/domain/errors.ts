import { StatusCode } from 'src/shared/constants/http-response-codes';
import { DomainError } from 'src/shared/errors/domain.error';

export class CompanyWebhookNotFoundError extends DomainError {
  constructor(message = 'Company webhook not found') {
    super(message, StatusCode.NOT_FOUND);
  }
}

export class CompanyWebhookNotAllowedError extends DomainError {
  constructor(message = 'You are not allowed to access this webhook') {
    super(message, StatusCode.FORBIDDEN);
  }
}

export class DuplicateCompanyWebhookError extends DomainError {
  constructor(
    message = 'This webhook URL is already registered for your company',
  ) {
    super(message, StatusCode.CONFLICT);
  }
}
