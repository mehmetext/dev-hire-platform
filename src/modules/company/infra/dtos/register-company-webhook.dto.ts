import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class RegisterCompanyWebhookDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'The webhook URL to receive events',
    example: 'https://example.com/webhooks/job-application',
  })
  url: string;
}
