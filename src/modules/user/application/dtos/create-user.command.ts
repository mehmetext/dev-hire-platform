import { UserRole } from '../../domain/enums/user-role.enum';
import { EmailVO } from '../../domain/value-objects/email.vo';

export class CreateUserCommand {
  constructor(
    public readonly email: EmailVO,
    public readonly password: string,
    public readonly role: UserRole,
  ) {}
}
