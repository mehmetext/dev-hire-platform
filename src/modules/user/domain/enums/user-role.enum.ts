export const UserRole = {
  COMPANY: 'COMPANY',
  CANDIDATE: 'CANDIDATE',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
