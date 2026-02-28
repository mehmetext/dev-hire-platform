import { CandidateProfile } from 'src/modules/candidate/domain/entities/candidate-profile.entity';
import { CompanyProfile } from 'src/modules/company/domain/entities/company-profile.entity';
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
    public readonly companyProfile?: CompanyProfile,
    public readonly candidateProfile?: CandidateProfile,
  ) {}

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  static create(params: {
    id: string;
    email: EmailVO;
    password: string;
    role: UserRole;
    companyProfile?: CompanyProfile;
    candidateProfile?: CandidateProfile;
  }): User {
    return new User(
      params.id,
      params.email,
      params.password,
      params.role,
      new Date(),
      new Date(),
      undefined,
      params.companyProfile,
      params.candidateProfile,
    );
  }
}
