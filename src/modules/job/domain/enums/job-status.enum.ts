export const JobStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus];
