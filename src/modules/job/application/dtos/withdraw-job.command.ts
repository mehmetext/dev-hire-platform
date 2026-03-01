export class WithdrawJobCommand {
  constructor(
    public readonly jobId: string,
    public readonly candidateProfileId: string,
  ) {}
}
