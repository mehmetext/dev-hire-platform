import { DomainError } from 'src/shared/errors/domain.error';

export class InvalidFileUploadTypeError extends DomainError {
  constructor(message = 'Invalid file upload type') {
    super(message, 'INVALID_FILE_UPLOAD_TYPE');
  }
}
