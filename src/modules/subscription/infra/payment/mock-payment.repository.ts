import { UpgradeCompanySubscriptionCommand } from '../../application/dtos/upgrade-company-subscription.command';
import { PaymentRepository } from '../../application/repositories/payment.repository';

export class MockPaymentRepository implements PaymentRepository {
  async chargeForPlanUpgrade(
    command: UpgradeCompanySubscriptionCommand,
  ): Promise<void> {
    console.log('Charging for plan upgrade', command);
    return Promise.resolve();
  }
}
