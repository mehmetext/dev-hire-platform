import { DomainErrorCode } from './domain-error-codes';

export class DomainError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: DomainErrorCode,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
