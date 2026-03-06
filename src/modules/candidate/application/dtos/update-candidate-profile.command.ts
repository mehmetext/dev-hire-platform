export class UpdateCandidateProfileCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
  ) {}
}
