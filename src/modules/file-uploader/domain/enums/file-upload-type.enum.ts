export const FileUploadType = {
  CV: 'CV',
  COMPANY_LOGO: 'COMPANY_LOGO',
} as const;

export type FileUploadType =
  (typeof FileUploadType)[keyof typeof FileUploadType];
