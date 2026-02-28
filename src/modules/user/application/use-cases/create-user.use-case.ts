import { Inject, Injectable } from '@nestjs/common';
import { CandidateRepository } from 'src/modules/candidate/application/repositories/candidate.repository';
import { CandidateProfile } from 'src/modules/candidate/domain/entities/candidate-profile.entity';
import { CompanyRepository } from 'src/modules/company/application/repositories/company.repository';
import { CompanyProfile } from 'src/modules/company/domain/entities/company-profile.entity';
import { SubscriptionPlan } from 'src/modules/company/domain/enums/subscription-plan.enum';
import { UnitOfWorkRepository } from 'src/shared/modules/unit-of-work/application/repositories/unit-of-work.repository';
import { User } from '../../domain/entities/user.entity';
import { CreateUserCommand } from '../dtos/create-user.command';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(UnitOfWorkRepository)
    private readonly unitOfWorkRepository: UnitOfWorkRepository,
    @Inject(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
    @Inject(CandidateRepository)
    private readonly candidateRepository: CandidateRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    return this.unitOfWorkRepository.execute(async (tx) => {
      const user = await this.userRepository.create(command, {
        tx,
      });

      let companyProfile: CompanyProfile | undefined;
      let candidateProfile: CandidateProfile | undefined;

      if (command.companyProfile) {
        companyProfile = await this.companyRepository.create(
          CompanyProfile.create({
            name: command.companyProfile.name,
            logoUrl: command.companyProfile.logoUrl,
            userId: user.id,
            subscriptionPlan: SubscriptionPlan.FREE,
          }),
          { tx },
        );
      }

      if (command.candidateProfile) {
        candidateProfile = await this.candidateRepository.create(
          CandidateProfile.create({
            firstName: command.candidateProfile.firstName,
            lastName: command.candidateProfile.lastName,
            userId: user.id,
          }),
          { tx },
        );
      }

      return User.create({
        id: user.id,
        email: user.email,
        password: user.password,
        role: user.role,
        companyProfile: companyProfile,
        candidateProfile: candidateProfile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      });
    });
  }
}
