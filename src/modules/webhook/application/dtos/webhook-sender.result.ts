export class WebhookSenderResult {
  constructor(
    public readonly status: number,
    public readonly statusText: string | undefined,
  ) {}
}
