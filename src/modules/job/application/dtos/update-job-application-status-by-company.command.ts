import { JobApplicationStatus } from '../../domain/enums/job-application-status.enum';

export class UpdateJobApplicationStatusByCompanyCommand {
  constructor(
    public readonly applicationId: string,
    public readonly companyProfileId: string,
    public readonly status: JobApplicationStatus,
  ) {}
}
