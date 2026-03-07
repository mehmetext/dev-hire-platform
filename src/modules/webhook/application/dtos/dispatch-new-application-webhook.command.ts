export class DispatchNewApplicationWebhookCommand {
  constructor(
    public readonly webhookId: string,
    public readonly jobId: string,
    public readonly candidateProfileId: string,
    public readonly candidateCVId: string,
    public readonly companyProfileId: string,
  ) {}
}
