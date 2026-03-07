import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/modules/prisma/prisma.module';
import { CompanyWebhookRepository } from '../application/repositories/company-webhook.repository';
import { DeleteCompanyWebhookUseCase } from '../application/use-cases/delete-company-webhook.use-case';
import { ListCompanyWebhooksUseCase } from '../application/use-cases/list-company-webhooks.use-case';
import { RegisterCompanyWebhookUseCase } from '../application/use-cases/register-company-webhook.use-case';
import { PrismaCompanyWebhookRepository } from './db/prisma-company-webhook.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: CompanyWebhookRepository,
      useClass: PrismaCompanyWebhookRepository,
    },
    RegisterCompanyWebhookUseCase,
    ListCompanyWebhooksUseCase,
    DeleteCompanyWebhookUseCase,
  ],
  exports: [
    CompanyWebhookRepository,
    RegisterCompanyWebhookUseCase,
    ListCompanyWebhooksUseCase,
    DeleteCompanyWebhookUseCase,
  ],
})
export class WebhookModule {}
