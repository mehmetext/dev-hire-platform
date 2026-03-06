export class GetUploadPresignedUrlResult {
  constructor(
    public readonly url: string,
    public readonly fields: Record<string, string>,
    public readonly key: string,
  ) {}
}
