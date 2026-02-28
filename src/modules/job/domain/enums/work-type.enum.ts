export const WorkType = {
  REMOTE: 'REMOTE',
  HYBRID: 'HYBRID',
  ONSITE: 'ONSITE',
} as const;

export type WorkType = (typeof WorkType)[keyof typeof WorkType];
