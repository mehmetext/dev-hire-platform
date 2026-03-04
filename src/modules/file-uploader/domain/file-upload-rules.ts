import { FileUploadType } from './enums/file-upload-type.enum';

export type FileUploadRule = {
  isPublic: boolean;
  allowedMimeTypes: string[];
  maxSizeMb: number;
  folder: string;
};

export const FileUploadRules: Record<FileUploadType, FileUploadRule> = {
  CV: {
    isPublic: false,
    allowedMimeTypes: ['application/pdf'],
    maxSizeMb: 5,
    folder: 'cvs',
  },
  COMPANY_LOGO: {
    isPublic: true,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeMb: 2,
    folder: 'companies/logos',
  },
};
