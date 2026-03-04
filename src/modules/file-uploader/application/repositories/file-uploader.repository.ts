export type UploadFileParams = {
  /** Raw file bytes (e.g. from Multer `buffer`) */
  body: Buffer;
  /** MIME type of the file, e.g. `image/png` */
  contentType: string;
  /** Object key inside the bucket, e.g. `avatars/user-1.png` */
  key: string;
  /** Whether the file should be publicly accessible */
  isPublic: boolean;
};

export type PresignedUploadUrlParams = {
  /** Object key inside the bucket, e.g. `avatars/user-1.png` */
  key: string;
  /** Whether the file should be publicly accessible */
  isPublic: boolean;
  /** MIME type of the file, e.g. `image/png` */
  contentType: string;
  /** Expiration in seconds (default: 900s) */
  expiresInSeconds?: number;
};

export type PresignedDownloadUrlParams = {
  /** Object key inside the bucket, e.g. `avatars/user-1.png` */
  key: string;
  /** Whether the file is stored in public or private bucket */
  isPublic: boolean;
  /** Expiration in seconds (default: 900s) */
  expiresInSeconds?: number;
};

export abstract class FileUploaderRepository {
  /**
   * Upload a file and return its accessible URL.
   */
  abstract upload(params: UploadFileParams): Promise<string>;

  /**
   * Generate a presigned URL that allows the client to upload a file directly.
   */
  abstract getUploadPresignedUrl(
    params: PresignedUploadUrlParams,
  ): Promise<string>;

  /**
   * Generate a presigned URL that allows the client to download a file.
   */
  abstract getDownloadPresignedUrl(
    params: PresignedDownloadUrlParams,
  ): Promise<string>;
}
