import { DomainError } from 'src/shared/errors/domain.error';

export class InvalidTokenError extends DomainError {
  constructor(message = 'Invalid token') {
    super(message, 'INVALID_TOKEN');
  }
}
