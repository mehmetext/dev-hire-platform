export class CandidateProfile {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | undefined,
  ) {}

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  static create(params: {
    id: string;
    firstName: string;
    lastName: string;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | undefined;
  }): CandidateProfile {
    return new CandidateProfile(
      params.id,
      params.firstName,
      params.lastName,
      params.userId,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
      params.deletedAt ?? undefined,
    );
  }
}
