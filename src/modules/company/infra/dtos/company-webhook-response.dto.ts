import { ApiProperty } from '@nestjs/swagger';

export class CompanyWebhookResponseDto {
  @ApiProperty({
    description: 'The webhook ID (Webhook entity id)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  webhookId: string;

  @ApiProperty({
    description: 'The webhook URL',
    example: 'https://example.com/webhooks/job-application',
  })
  url: string;

  @ApiProperty({
    description: 'When the company webhook was created',
    example: new Date().toISOString(),
  })
  createdAt: Date;
}
