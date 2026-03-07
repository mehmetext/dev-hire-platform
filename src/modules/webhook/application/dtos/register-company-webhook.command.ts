export class RegisterCompanyWebhookCommand {
  constructor(
    public readonly companyProfileId: string,
    public readonly url: string,
  ) {}
}
