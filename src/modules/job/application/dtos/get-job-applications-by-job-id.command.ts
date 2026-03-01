export class GetJobApplicationsByJobIdCommand {
  constructor(
    public readonly jobId: string,
    public readonly companyProfileId: string,
  ) {}
}
