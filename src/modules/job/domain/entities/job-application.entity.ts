import { JobApplicationStatus } from '../enums/job-application-status.enum';

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
    );
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
