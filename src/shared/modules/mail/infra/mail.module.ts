import { Module } from '@nestjs/common';
import { MailRepository } from '../application/repositories/mail.repository';
import { SendApplicationEmailUseCase } from '../application/use-cases/send-application-email.use-case';
import { MockMailRepository } from './mail/mock-mail.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: MailRepository,
      useClass: MockMailRepository,
    },
    SendApplicationEmailUseCase,
  ],
  exports: [],
})
export class MailModule {}
