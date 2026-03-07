import { CompanyProfile } from 'src/modules/company/domain/entities/company-profile.entity';
import { JobStatus } from '../enums/job-status.enum';
import { WorkType } from '../enums/work-type.enum';
import {
  JobExpiredError,
  JobNotActiveError,
  JobNotAllowedError,
} from '../errors';

export class Job {
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
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | undefined,
    public readonly companyProfile?: CompanyProfile,
  ) {}

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  static create(params: {
    id: string;
    companyProfileId: string;
    title: string;
    description: string;
    requirements: string[];
    location: string;
    workType: WorkType;
    status: JobStatus;
    expiresAt: Date | undefined;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | undefined;
    companyProfile?: CompanyProfile;
  }): Job {
    return new Job(
      params.id,
      params.companyProfileId,
      params.title,
      params.description,
      params.requirements,
      params.location,
      params.workType,
      params.status,
      params.expiresAt,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
      params.deletedAt ?? undefined,
      params.companyProfile ?? undefined,
    );
  }

  isOpenForApplications(): boolean {
    if (this.status !== JobStatus.ACTIVE) return false;
    if (this.expiresAt && this.expiresAt < new Date()) return false;
    return true;
  }

  assertCanAcceptApplication(): void {
    if (this.status !== JobStatus.ACTIVE) {
      throw new JobNotActiveError();
    }
    if (this.expiresAt && this.expiresAt < new Date()) {
      throw new JobExpiredError();
    }
  }

  assertOwnedBy(companyProfileId: string): void {
    if (this.companyProfileId !== companyProfileId) {
      throw new JobNotAllowedError();
    }
  }

  isExpired(): boolean {
    return !!this.expiresAt && this.expiresAt < new Date();
  }
}
