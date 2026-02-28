import { UserRole } from '../enums/user-role.enum';
import { EmailVO } from '../value-objects/email.vo';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: EmailVO,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | undefined,
  ) {}

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
