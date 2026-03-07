import { Module, forwardRef } from '@nestjs/common';
import { JobModule } from 'src/modules/job/infra/job.module';
import { SubscriptionLimitService } from '../application/subscription-limit.service';

@Module({
  imports: [forwardRef(() => JobModule)],
  providers: [SubscriptionLimitService],
  exports: [SubscriptionLimitService],
})
export class SubscriptionModule {}
