import { JobApplicationStatus } from '../../domain/enums/job-application-status.enum';

export class UpdateJobApplicationStatusByCompanyCommand {
  constructor(
    public readonly jobId: string,
    public readonly companyProfileId: string,
    public readonly candidateProfileId: string,
    public readonly status: JobApplicationStatus,
  ) {}
}
