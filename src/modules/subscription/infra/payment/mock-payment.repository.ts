import { ChargeForPlanUpgradeCommand } from '../../application/dtos/charge-for-plan-upgrade-command';
import { PaymentRepository } from '../../application/repositories/payment.repository';

export class MockPaymentRepository implements PaymentRepository {
  async chargeForPlanUpgrade(
    command: ChargeForPlanUpgradeCommand,
  ): Promise<void> {
    console.log('Charging for plan upgrade', command);
    return Promise.resolve();
  }
}
