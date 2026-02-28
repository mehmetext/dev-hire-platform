import { WorkType } from 'src/generated/prisma/enums';
import { JobStatus } from '../../domain/enums/job-status.enum';

export class UpdateJobCommand {
  constructor(
    public readonly id: string,
    public readonly companyProfileId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly requirements: string[],
    public readonly location: string,
    public readonly workType: WorkType,
    public readonly status: JobStatus,
    public readonly expiresAt: Date | undefined,
  ) {}
}
