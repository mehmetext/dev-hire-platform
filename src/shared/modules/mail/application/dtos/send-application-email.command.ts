export class SendApplicationEmailCommand {
  constructor(
    public readonly jobId: string,
    public readonly candidateProfileId: string,
    public readonly candidateCVUrl: string,
  ) {}
}
