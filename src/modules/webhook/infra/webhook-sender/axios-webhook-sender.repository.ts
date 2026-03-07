import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { WebhookSenderResult } from '../../application/dtos/webhook-sender.result';
import { WebhookSenderRepository } from '../../application/repositories/webhook-sender.repository';

export class AxiosWebhookSenderRepository implements WebhookSenderRepository {
  constructor(@Inject(HttpService) private readonly httpService: HttpService) {}

  async sendWebhook(
    url: string,
    payload: Record<string, unknown>,
  ): Promise<WebhookSenderResult> {
    const response = await firstValueFrom(
      this.httpService.post(url, payload, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    return new WebhookSenderResult(response.status, response.statusText);
  }
}
