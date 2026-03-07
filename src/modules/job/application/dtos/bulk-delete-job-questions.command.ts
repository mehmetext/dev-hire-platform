export class BulkDeleteJobQuestionsCommand {
  constructor(
    public readonly jobId: string,
    public readonly companyProfileId: string,
    public readonly questionIds: string[],
  ) {}
}
