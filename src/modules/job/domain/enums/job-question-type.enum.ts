export const JobQuestionType = {
  TEXT: 'TEXT',
  TEXTAREA: 'TEXTAREA',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
} as const;

export type JobQuestionType =
  (typeof JobQuestionType)[keyof typeof JobQuestionType];
