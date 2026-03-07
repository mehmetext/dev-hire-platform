import { DomainError } from 'src/shared/errors/domain.error';

export class InvalidFileUploadTypeError extends DomainError {
  constructor(message = 'Invalid file upload type') {
    super(message, 'INVALID_FILE_UPLOAD_TYPE');
  }
}

export class InvalidFileUploadContentTypeError extends DomainError {
  constructor(
    public readonly contentType: string,
    public readonly allowedMimeTypes: string[],
  ) {
    super(
      `Invalid content type for file upload type ${contentType}. Allowed types: ${allowedMimeTypes.join(
        ', ',
      )}`,
      'INVALID_FILE_UPLOAD_CONTENT_TYPE',
    );
  }
}
