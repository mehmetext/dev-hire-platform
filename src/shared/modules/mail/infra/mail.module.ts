import { Module } from '@nestjs/common';
import { MailRepository } from '../application/repositories/mail.repository';
import { MockMailRepository } from './mail/mock-mail.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: MailRepository,
      useClass: MockMailRepository,
    },
  ],
  exports: [],
})
export class MailModule {}
