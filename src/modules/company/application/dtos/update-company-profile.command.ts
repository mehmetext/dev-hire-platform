export class UpdateCompanyProfileCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name?: string,
    public readonly logoUrl?: string,
  ) {}
}
