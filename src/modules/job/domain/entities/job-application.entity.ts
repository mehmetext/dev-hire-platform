import { CandidateCV } from 'src/modules/candidate/domain/entities/candidate-cv.entity';
import { CandidateProfile } from 'src/modules/candidate/domain/entities/candidate-profile.entity';
import { JobApplicationStatus } from '../enums/job-application-status.enum';
import { JobApplicationNotPendingError } from '../errors';
import { Job } from './job.entity';

export class JobApplication {
  constructor(
    public readonly id: string,
    public readonly jobId: string,
    public readonly candidateProfileId: string,
    public readonly candidateCVId: string,
    public readonly status: JobApplicationStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | undefined,
    public readonly candidateProfile: CandidateProfile | undefined,
    public readonly job: Job | undefined,
    public readonly candidateCV: CandidateCV | undefined,
  ) {}

  static create(params: {
    id: string;
    jobId: string;
    candidateProfileId: string;
    candidateCVId: string;
    status: JobApplicationStatus;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | undefined;
    candidateProfile?: CandidateProfile | undefined;
    job?: Job | undefined;
    candidateCV?: CandidateCV | undefined;
  }): JobApplication {
    return new JobApplication(
      params.id,
      params.jobId,
      params.candidateProfileId,
      params.candidateCVId,
      params.status,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
      params.deletedAt ?? undefined,
      params.candidateProfile ?? undefined,
      params.job ?? undefined,
      params.candidateCV ?? undefined,
    );
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  assertCanWithdraw(): void {
    if (this.status !== JobApplicationStatus.PENDING) {
      throw new JobApplicationNotPendingError();
    }
  }
}
