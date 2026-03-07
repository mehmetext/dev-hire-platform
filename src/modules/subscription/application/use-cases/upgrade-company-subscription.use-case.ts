import { Inject } from '@nestjs/common';
import { CompanyRepository } from 'src/modules/company/application/repositories/company.repository';
import { CompanyProfile } from 'src/modules/company/domain/entities/company-profile.entity';
import {
  CompanyProfileAlreadyUpgradedError,
  CompanyProfileNotFoundError,
} from 'src/modules/company/domain/errors';
import { UnitOfWorkRepository } from 'src/shared/modules/unit-of-work/application/repositories/unit-of-work.repository';
import { UpgradeCompanySubscriptionCommand } from '../dtos/upgrade-company-subscription.command';
import { PaymentRepository } from '../repositories/payment.repository';

export class UpgradeCompanySubscriptionUseCase {
  constructor(
    @Inject(PaymentRepository)
    private readonly paymentRepository: PaymentRepository,
    @Inject(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
    @Inject(UnitOfWorkRepository)
    private readonly unitOfWorkRepository: UnitOfWorkRepository,
  ) {}

  async execute(command: UpgradeCompanySubscriptionCommand): Promise<void> {
    return this.unitOfWorkRepository.execute(async (tx) => {
      const companyProfile = await this.companyRepository.findById(
        command.companyProfileId,
      );

      if (!companyProfile) {
        throw new CompanyProfileNotFoundError();
      }

      if (companyProfile.subscriptionPlan === command.plan) {
        throw new CompanyProfileAlreadyUpgradedError();
      }

      await this.paymentRepository.chargeForPlanUpgrade(command, { tx });

      const upgraded = CompanyProfile.create({
        ...companyProfile,
        subscriptionPlan: command.plan,
      });

      await this.companyRepository.update(upgraded, { tx });
    });
  }
}
