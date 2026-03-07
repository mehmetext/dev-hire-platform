import { ChargeForPlanUpgradeCommand } from '../dtos/charge-for-plan-upgrade-command';

export abstract class PaymentRepository {
  abstract chargeForPlanUpgrade(
    command: ChargeForPlanUpgradeCommand,
  ): Promise<void>;
}
