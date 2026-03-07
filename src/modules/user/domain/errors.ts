import { DomainError } from 'src/shared/errors/domain.error';

export class UserAlreadyExistsError extends DomainError {
  constructor(message = 'User already exists') {
    super(message, 'USER_ALREADY_EXISTS');
  }
}

export class UserNotFoundError extends DomainError {
  constructor(message = 'User not found') {
    super(message, 'USER_NOT_FOUND');
  }
}

export class UserInvalidCredentialsError extends DomainError {
  constructor(message = 'Invalid credentials') {
    super(message, 'INVALID_CREDENTIALS');
  }
}

export class InvalidEmailError extends DomainError {
  constructor(message = 'Invalid email') {
    super(message, 'INVALID_EMAIL');
  }
}
