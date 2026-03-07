import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiNoContentResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { UserResponseDto } from 'src/modules/user/infra/dtos/user-response.dto';
import { RegisterCompanyWebhookCommand } from 'src/modules/webhook/application/dtos/register-company-webhook.command';
import { DeleteCompanyWebhookUseCase } from 'src/modules/webhook/application/use-cases/delete-company-webhook.use-case';
import { ListCompanyWebhooksUseCase } from 'src/modules/webhook/application/use-cases/list-company-webhooks.use-case';
import { RegisterCompanyWebhookUseCase } from 'src/modules/webhook/application/use-cases/register-company-webhook.use-case';
import { ApiCreatedResponseGeneric } from 'src/shared/decorators/api-created-response-generic.decorator';
import { ApiOkResponseGeneric } from 'src/shared/decorators/api-ok-response-generic.decorator';
import { RequireCompanyProfileGuard } from 'src/shared/guards/require-company-profile.guard';
import { UpdateCompanyProfileCommand } from '../../application/dtos/update-company-profile.command';
import { UpdateCompanyProfileUseCase } from '../../application/use-cases/update-company-profile.use-case';
import { CompanyResponseDto } from '../dtos/company-response.dto';
import { CompanyWebhookResponseDto } from '../dtos/company-webhook-response.dto';
import { RegisterCompanyWebhookDto } from '../dtos/register-company-webhook.dto';
import { UpdateCompanyProfileDto } from '../dtos/update-company-profile.dto';

@Controller('company')
export class CompanyController {
  constructor(
    @Inject(UpdateCompanyProfileUseCase)
    private readonly updateCompanyProfileUseCase: UpdateCompanyProfileUseCase,
    @Inject(RegisterCompanyWebhookUseCase)
    private readonly registerCompanyWebhookUseCase: RegisterCompanyWebhookUseCase,
    @Inject(ListCompanyWebhooksUseCase)
    private readonly listCompanyWebhooksUseCase: ListCompanyWebhooksUseCase,
    @Inject(DeleteCompanyWebhookUseCase)
    private readonly deleteCompanyWebhookUseCase: DeleteCompanyWebhookUseCase,
  ) {}

  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  @ApiOkResponseGeneric(CompanyResponseDto)
  async updateProfile(
    @Body() updateCompanyProfileDto: UpdateCompanyProfileDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    const id = req.user.companyProfile!.id;

    return this.updateCompanyProfileUseCase.execute(
      new UpdateCompanyProfileCommand(
        id,
        req.user.id,
        updateCompanyProfileDto.name,
        updateCompanyProfileDto.logoUrl,
      ),
    );
  }

  @Post('webhooks')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  @ApiCreatedResponseGeneric(CompanyWebhookResponseDto)
  async registerWebhook(
    @Body() dto: RegisterCompanyWebhookDto,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    const companyWebhook = await this.registerCompanyWebhookUseCase.execute(
      new RegisterCompanyWebhookCommand(req.user.companyProfile!.id, dto.url),
    );
    return {
      webhookId: companyWebhook.webhookId,
      url: companyWebhook.webhook?.webhookUrl ?? dto.url,
      createdAt: companyWebhook.createdAt,
    } satisfies CompanyWebhookResponseDto;
  }

  @Get('webhooks')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  @ApiOkResponseGeneric(CompanyWebhookResponseDto, { isArray: true })
  async listWebhooks(@Req() req: Request & { user: UserResponseDto }) {
    const list = await this.listCompanyWebhooksUseCase.execute(
      req.user.companyProfile!.id,
    );
    return list.map((cw) => ({
      webhookId: cw.webhookId,
      url: cw.webhook?.webhookUrl ?? '',
      createdAt: cw.createdAt,
    }));
  }

  @Delete('webhooks/:webhookId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RequireCompanyProfileGuard)
  @ApiNoContentResponse()
  async deleteWebhook(
    @Param('webhookId') webhookId: string,
    @Req() req: Request & { user: UserResponseDto },
  ) {
    await this.deleteCompanyWebhookUseCase.execute(
      webhookId,
      req.user.companyProfile!.id,
    );
  }
}
