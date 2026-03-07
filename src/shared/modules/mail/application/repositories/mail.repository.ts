import { SendApplicationEmailCommand } from '../dtos/send-application-email.command';

export abstract class MailRepository {
  abstract sendApplicationEmail(
    command: SendApplicationEmailCommand,
  ): Promise<void>;
}
