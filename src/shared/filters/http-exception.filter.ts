import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainErrorCode } from '../errors/domain-error-codes';
import { DomainError } from '../errors/domain.error';

const DOMAIN_ERROR_CODE_TO_HTTP_STATUS: Record<DomainErrorCode, number> = {
  INTERNAL_ERROR: 500,
  USER_NOT_FOUND: 404,
  USER_ALREADY_EXISTS: 409,
  INVALID_CREDENTIALS: 401,
  INVALID_EMAIL: 400,
  JOB_NOT_FOUND: 404,
  JOB_NOT_ACTIVE: 400,
  JOB_EXPIRED: 400,
  JOB_ALREADY_APPLIED: 409,
  JOB_NOT_ALLOWED: 403,
  JOB_APPLICATION_NOT_FOUND: 404,
  JOB_APPLICATION_NOT_PENDING: 400,
  CANDIDATE_CV_NOT_FOUND: 404,
  COMPANY_PROFILE_NOT_FOUND: 404,
  COMPANY_PROFILE_NOT_ALLOWED: 403,
  COMPANY_PROFILE_ALREADY_UPGRADED: 400,
  CANDIDATE_PROFILE_NOT_FOUND: 404,
  CANDIDATE_PROFILE_NOT_ALLOWED: 403,
  CANDIDATE_CV_NOT_ALLOWED: 403,
  COMPANY_WEBHOOK_NOT_FOUND: 404,
  COMPANY_WEBHOOK_NOT_ALLOWED: 403,
  DUPLICATE_COMPANY_WEBHOOK: 409,
  INVALID_TOKEN: 401,
  INVALID_FILE_UPLOAD_TYPE: 400,
  INVALID_FILE_UPLOAD_CONTENT_TYPE: 400,
};

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null && 'message' in res) {
        message = (res as { message: string | string[] }).message;
      } else if (typeof res === 'string') {
        message = res;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof DomainError) {
      status = DOMAIN_ERROR_CODE_TO_HTTP_STATUS[exception.code];
      message = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      message,
    });
  }
}
