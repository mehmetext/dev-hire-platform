import { TransactionContext } from 'src/shared/modules/unit-of-work/application/repositories/unit-of-work.repository';
import { UpgradeCompanySubscriptionCommand } from '../dtos/upgrade-company-subscription.command';

export abstract class PaymentRepository {
  abstract chargeForPlanUpgrade(
    command: UpgradeCompanySubscriptionCommand,
    options?: { tx?: TransactionContext },
  ): Promise<void>;
}
