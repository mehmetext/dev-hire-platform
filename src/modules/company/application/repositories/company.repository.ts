import { TransactionContext } from 'src/shared/modules/unit-of-work/application/repositories/unit-of-work.repository';
import { CompanyProfile } from '../../domain/entities/company-profile.entity';

export abstract class CompanyRepository {
  abstract create(
    companyProfile: CompanyProfile,
    options?: { tx?: TransactionContext },
  ): Promise<CompanyProfile>;
  abstract findById(id: string): Promise<CompanyProfile | null>;
  abstract update(companyProfile: CompanyProfile): Promise<CompanyProfile>;
  abstract delete(id: string): Promise<void>;
}
