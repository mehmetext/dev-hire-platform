import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FileUploaderRepository,
  PresignedDownloadUrlParams,
  PresignedPostResult,
  PresignedUploadUrlParams,
  UploadFileParams,
} from '../../application/repositories/file-uploader.repository';

@Injectable()
export class S3FileUploaderRepository extends FileUploaderRepository {
  private readonly s3: S3Client;
  private readonly region: string;
  private readonly endpoint?: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly publicBucketName: string;
  private readonly privateBucketName: string;

  constructor(private readonly configService: ConfigService) {
    super();

    this.region = this.configService.getOrThrow<string>('AWS_REGION');
    this.endpoint = this.configService.get<string>('AWS_S3_ENDPOINT');
    this.accessKeyId =
      this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID');
    this.secretAccessKey = this.configService.getOrThrow<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    this.publicBucketName = this.configService.getOrThrow<string>(
      'AWS_PUBLIC_BUCKET_NAME',
    );
    this.privateBucketName = this.configService.getOrThrow<string>(
      'AWS_PRIVATE_BUCKET_NAME',
    );

    this.s3 = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      forcePathStyle: !!this.endpoint,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  async upload(params: UploadFileParams): Promise<string> {
    const bucket = params.isPublic
      ? this.publicBucketName
      : this.privateBucketName;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      ACL: params.isPublic ? 'public-read' : undefined,
    });

    await this.s3.send(command);

    // LocalStack için URL formatı
    if (this.endpoint?.includes('localhost')) {
      return `${this.endpoint}/${bucket}/${params.key}`;
    }

    // Gerçek S3 URL formatı
    return `https://${bucket}.s3.${this.region}.amazonaws.com/${params.key}`;
  }

  async getUploadPresignedUrl(
    params: PresignedUploadUrlParams,
  ): Promise<PresignedPostResult> {
    const bucket = params.isPublic
      ? this.publicBucketName
      : this.privateBucketName;

    const expiresIn = params.expiresInSeconds ?? 900;

    const maxSizeBytes = params.maxSizeMb * 1024 * 1024;

    const inputFields: Record<string, string> = {
      'Content-Type': params.contentType,
    };

    const { url, fields } = await createPresignedPost(this.s3, {
      Bucket: bucket,
      Key: params.key,
      Conditions: [
        ['content-length-range', 0, maxSizeBytes],
        ['starts-with', '$Content-Type', params.contentType],
      ],
      Fields: inputFields,
      Expires: expiresIn,
    });

    return { url, fields };
  }

  async getDownloadPresignedUrl(
    params: PresignedDownloadUrlParams,
  ): Promise<string> {
    const bucket = params.isPublic
      ? this.publicBucketName
      : this.privateBucketName;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: params.key,
    });

    const expiresIn = params.expiresInSeconds ?? 900;

    return await getSignedUrl(this.s3, command, { expiresIn });
  }

  getPublicUrl(key: string): string {
    if (this.endpoint?.includes('localhost')) {
      return `${this.endpoint}/${this.publicBucketName}/${key}`;
    }

    return `https://${this.publicBucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
