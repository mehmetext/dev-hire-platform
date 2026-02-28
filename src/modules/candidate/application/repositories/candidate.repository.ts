import { TransactionContext } from 'src/shared/modules/unit-of-work/application/repositories/unit-of-work.repository';
import { CandidateProfile } from '../../domain/entities/candidate-profile.entity';

export abstract class CandidateRepository {
  abstract create(
    candidateProfile: CandidateProfile,
    options?: { tx?: TransactionContext },
  ): Promise<CandidateProfile>;
  abstract findById(id: string): Promise<CandidateProfile | null>;
  abstract update(
    candidateProfile: CandidateProfile,
  ): Promise<CandidateProfile>;
  abstract delete(id: string): Promise<void>;
}
