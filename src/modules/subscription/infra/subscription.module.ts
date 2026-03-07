import { Module, forwardRef } from '@nestjs/common';
import { CompanyModule } from 'src/modules/company/infra/company.module';
import { JobModule } from 'src/modules/job/infra/job.module';
import { UnitOfWorkModule } from 'src/shared/modules/unit-of-work/unit-of-work.module';
import { PaymentRepository } from '../application/repositories/payment.repository';
import { SubscriptionLimitService } from '../application/subscription-limit.service';
import { UpgradeCompanySubscriptionUseCase } from '../application/use-cases/upgrade-company-subscription.use-case';
import { SubscriptionController } from './http/subscription.controller';
import { MockPaymentRepository } from './payment/mock-payment.repository';

@Module({
  imports: [forwardRef(() => JobModule), CompanyModule, UnitOfWorkModule],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionLimitService,
    UpgradeCompanySubscriptionUseCase,
    {
      provide: PaymentRepository,
      useClass: MockPaymentRepository,
    },
  ],
  exports: [SubscriptionLimitService],
})
export class SubscriptionModule {}
