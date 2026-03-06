import {
  Body,
  Controller,
  Inject,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { ApiOkResponseGeneric } from 'src/shared/decorators/api-ok-response-generic.decorator';
import { UpdateCompanyProfileCommand } from '../../application/dtos/update-company-profile.command';
import { UpdateCompanyProfileUseCase } from '../../application/use-cases/update-company-profile.use-case';
import { CompanyProfileNotFoundError } from '../../domain/errors';
import { CompanyResponseDto } from '../dtos/company-response.dto';
import { UpdateCompanyProfileDto } from '../dtos/update-company-profile.dto';

@Controller('company')
export class CompanyController {
  constructor(
    @Inject(UpdateCompanyProfileUseCase)
    private readonly updateCompanyProfileUseCase: UpdateCompanyProfileUseCase,
  ) {}

  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponseGeneric(CompanyResponseDto)
  async updateProfile(
    @Body() updateCompanyProfileDto: UpdateCompanyProfileDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    if (!req.user.companyProfile?.id) {
      throw new CompanyProfileNotFoundError();
    }

    const id = req.user.companyProfile.id;

    return this.updateCompanyProfileUseCase.execute(
      new UpdateCompanyProfileCommand(
        id,
        req.user.id,
        updateCompanyProfileDto.name,
        updateCompanyProfileDto.logoUrl,
      ),
    );
  }
}
