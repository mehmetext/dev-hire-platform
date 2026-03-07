export class Webhook {
  constructor(
    public readonly id: string,
    public readonly webhookUrl: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | undefined,
  ) {}

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  static create(params: {
    id: string;
    webhookUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | undefined;
  }): Webhook {
    return new Webhook(
      params.id,
      params.webhookUrl,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
      params.deletedAt ?? undefined,
    );
  }
}
