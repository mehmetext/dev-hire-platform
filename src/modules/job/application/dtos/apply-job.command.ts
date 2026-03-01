export class ApplyJobCommand {
  constructor(
    public readonly jobId: string,
    public readonly candidateProfileId: string,
    public readonly candidateCVId: string,
  ) {}
}
