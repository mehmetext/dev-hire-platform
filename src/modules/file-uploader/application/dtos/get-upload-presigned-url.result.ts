export class GetUploadPresignedUrlResult {
  constructor(
    public readonly url: string,
    public readonly key: string,
  ) {}
}
