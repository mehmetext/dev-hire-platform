import { UserRole } from '../../domain/enums/user-role.enum';
import { EmailVO } from '../../domain/value-objects/email.vo';

export class CreateCompanyProfileCommand {
  constructor(
    public readonly name: string,
    public readonly logoUrl?: string,
  ) {}
}

export class CreateCandidateProfileCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
  ) {}
}

export class CreateUserCommand {
  constructor(
    public readonly email: EmailVO,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly companyProfile?: CreateCompanyProfileCommand,
    public readonly candidateProfile?: CreateCandidateProfileCommand,
  ) {}
}
