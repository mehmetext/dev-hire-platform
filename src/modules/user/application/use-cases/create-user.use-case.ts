import { Inject, Injectable } from '@nestjs/common';
import { CompanyRepository } from 'src/modules/company/application/repositories/company.repository';
import { CompanyProfile } from 'src/modules/company/domain/entities/company-profile.entitiy';
import { SubscriptionPlan } from 'src/modules/company/domain/enums/subscription-plan.enum';
import { UnitOfWorkRepository } from 'src/shared/modules/unit-of-work/application/repositories/unit-of-work.repository';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { CreateUserCommand } from '../dtos/create-user.command';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(UnitOfWorkRepository)
    private readonly unitOfWorkRepository: UnitOfWorkRepository,
    @Inject(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    return this.unitOfWorkRepository.execute(async (tx) => {
      const user = await this.userRepository.create(command, {
        tx,
      });

      if (command.companyProfile) {
        await this.companyRepository.create(
          CompanyProfile.create({
            name: command.companyProfile.name,
            logoUrl: command.companyProfile.logoUrl,
            userId: user.id,
            subscriptionPlan: SubscriptionPlan.FREE,
          }),
          { tx },
        );
      }

      /* if (command.candidateProfile) {
        await this.candidateRepository.create(command.candidateProfile, {
          tx,
        });
      } */

      return user;
    });
  }
}
