import { CandidateProfile } from 'src/modules/candidate/domain/entities/candidate-profile.entity';
import { JobApplicationStatus } from '../enums/job-application-status.enum';

export class JobApplication {
  constructor(
    public readonly jobId: string,
    public readonly candidateProfileId: string,
    public readonly candidateCVId: string,
    public readonly status: JobApplicationStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | undefined,
    public readonly candidateProfile: CandidateProfile | undefined,
  ) {}

  static create(params: {
    jobId: string;
    candidateProfileId: string;
    candidateCVId: string;
    status: JobApplicationStatus;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | undefined;
    candidateProfile?: CandidateProfile | undefined;
  }): JobApplication {
    return new JobApplication(
      params.jobId,
      params.candidateProfileId,
      params.candidateCVId,
      params.status,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
      params.deletedAt ?? undefined,
      params.candidateProfile ?? undefined,
    );
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
