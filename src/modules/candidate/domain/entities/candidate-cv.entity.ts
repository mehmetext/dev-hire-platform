export class CandidateCV {
  constructor(
    public readonly id: string,
    public readonly candidateProfileId: string,
    public readonly title: string | undefined,
    public readonly url: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | undefined,
  ) {}

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  static create(params: {
    id: string;
    candidateProfileId: string;
    title: string | undefined;
    url: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | undefined;
  }): CandidateCV {
    return new CandidateCV(
      params.id,
      params.candidateProfileId,
      params.title,
      params.url,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
      params.deletedAt ?? undefined,
    );
  }
}
