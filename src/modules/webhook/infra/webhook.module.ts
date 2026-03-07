import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/modules/prisma/prisma.module';
import { CompanyWebhookRepository } from '../application/repositories/company-webhook.repository';
import { WebhookDeliveryRepository } from '../application/repositories/webhook-delivery.repository';
import { DeleteCompanyWebhookUseCase } from '../application/use-cases/delete-company-webhook.use-case';
import { DispatchNewApplicationWebhookUseCase } from '../application/use-cases/dispatch-new-application-webhook.use-case';
import { ListCompanyWebhooksUseCase } from '../application/use-cases/list-company-webhooks.use-case';
import { RegisterCompanyWebhookUseCase } from '../application/use-cases/register-company-webhook.use-case';
import { PrismaCompanyWebhookRepository } from './db/prisma-company-webhook.repository';
import { PrismaWebhookDeliveryRepository } from './db/prisma-webhook-delivery.repository';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [
    {
      provide: CompanyWebhookRepository,
      useClass: PrismaCompanyWebhookRepository,
    },
    {
      provide: WebhookDeliveryRepository,
      useClass: PrismaWebhookDeliveryRepository,
    },
    DispatchNewApplicationWebhookUseCase,
    RegisterCompanyWebhookUseCase,
    ListCompanyWebhooksUseCase,
    DeleteCompanyWebhookUseCase,
  ],
  exports: [
    CompanyWebhookRepository,
    DispatchNewApplicationWebhookUseCase,
    RegisterCompanyWebhookUseCase,
    ListCompanyWebhooksUseCase,
    DeleteCompanyWebhookUseCase,
  ],
})
export class WebhookModule {}
