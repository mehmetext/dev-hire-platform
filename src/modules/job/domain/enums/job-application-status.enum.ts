export const JobApplicationStatus = {
  PENDING: 'PENDING',
  REVIEWED: 'REVIEWED',
  INTERVIEWED: 'INTERVIEWED',
  OFFER_MADE: 'OFFER_MADE',
  HIRED: 'HIRED',
  REJECTED: 'REJECTED',
} as const;

export type JobApplicationStatus =
  (typeof JobApplicationStatus)[keyof typeof JobApplicationStatus];
