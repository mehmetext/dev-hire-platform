import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNoContentResponse } from '@nestjs/swagger';
import { SubscriptionPlan } from 'src/modules/company/domain/enums/subscription-plan.enum';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { RequireCompanyProfileGuard } from 'src/shared/guards/require-company-profile.guard';
import { UpgradeCompanySubscriptionUseCase } from '../../application/use-cases/upgrade-company-subscription.use-case';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    @Inject(UpgradeCompanySubscriptionUseCase)
    private readonly upgradeCompanySubscriptionUseCase: UpgradeCompanySubscriptionUseCase,
  ) {}

  @Post('upgrade-to-pro')
  @ApiBearerAuth()
  @ApiNoContentResponse()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  async upgradeToPro(@Req() req: Request & { user: UserResponseDto }) {
    return this.upgradeCompanySubscriptionUseCase.execute({
      companyProfileId: req.user.companyProfile!.id,
      plan: SubscriptionPlan.PRO,
    });
  }
}
