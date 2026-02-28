import { CandidateProfile } from 'src/modules/candidate/domain/entities/candidate-profile.entity';
import { CompanyProfile } from 'src/modules/company/domain/entities/company-profile.entity';
import { UserRole } from '../../domain/enums/user-role.enum';

export class UserResult {
  id: string;
  email: string;
  role: UserRole;
  companyProfile?: CompanyProfile;
  candidateProfile?: CandidateProfile;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
