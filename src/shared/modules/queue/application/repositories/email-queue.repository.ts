import { SendApplicationEmailCommand } from 'src/shared/modules/mail/application/dtos/send-application-email.command';

export abstract class EmailQueueRepository {
  abstract sendApplicationEmail(
    command: SendApplicationEmailCommand,
  ): Promise<void>;
}
