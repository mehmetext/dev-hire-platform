import { SendApplicationEmailCommand } from '../../application/dtos/send-application-email.command';
import { MailRepository } from '../../application/repositories/mail.repository';

export class MockMailRepository implements MailRepository {
  async sendApplicationEmail(
    command: SendApplicationEmailCommand,
  ): Promise<void> {
    console.log('Sending application email', command);
    return Promise.resolve();
  }
}
