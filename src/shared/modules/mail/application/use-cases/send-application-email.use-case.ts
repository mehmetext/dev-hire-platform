import { Inject } from '@nestjs/common';
import { SendApplicationEmailCommand } from '../dtos/send-application-email.command';
import { MailRepository } from '../repositories/mail.repository';

export class SendApplicationEmailUseCase {
  constructor(
    @Inject(MailRepository)
    private readonly mailRepository: MailRepository,
  ) {}

  async execute(command: SendApplicationEmailCommand): Promise<void> {
    await this.mailRepository.sendApplicationEmail(command);
  }
}
