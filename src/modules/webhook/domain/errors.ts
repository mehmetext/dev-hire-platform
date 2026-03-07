import { DomainError } from 'src/shared/errors/domain.error';

export class CompanyWebhookNotFoundError extends DomainError {
  constructor(message = 'Company webhook not found') {
    super(message, 'COMPANY_WEBHOOK_NOT_FOUND');
  }
}

export class CompanyWebhookNotAllowedError extends DomainError {
  constructor(message = 'You are not allowed to access this webhook') {
    super(message, 'COMPANY_WEBHOOK_NOT_ALLOWED');
  }
}

export class DuplicateCompanyWebhookError extends DomainError {
  constructor(
    message = 'This webhook URL is already registered for your company',
  ) {
    super(message, 'DUPLICATE_COMPANY_WEBHOOK');
  }
}
