import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { RegisterCompanyWebhookCommand } from '../../application/dtos/register-company-webhook.command';
import { CompanyWebhookRepository } from '../../application/repositories/company-webhook.repository';
import { CompanyWebhook } from '../../domain/entities/company-webhook.entity';
import {
  CompanyWebhookNotAllowedError,
  CompanyWebhookNotFoundError,
  DuplicateCompanyWebhookError,
} from '../../domain/errors';
import { PrismaCompanyWebhookMapper } from './prisma-company-webhook.mapper';

@Injectable()
export class PrismaCompanyWebhookRepository implements CompanyWebhookRepository {
  constructor(private readonly prisma: PrismaService) {}

  async register(
    command: RegisterCompanyWebhookCommand,
  ): Promise<CompanyWebhook> {
    let webhook = await this.prisma.webhook.findFirst({
      where: { webhookUrl: command.url, deletedAt: null },
    });

    if (!webhook) {
      webhook = await this.prisma.webhook.create({
        data: { webhookUrl: command.url },
      });
    }

    try {
      const companyWebhook = await this.prisma.companyWebhook.create({
        data: {
          companyProfileId: command.companyProfileId,
          webhookId: webhook.id,
        },
        include: { webhook: true },
      });
      return PrismaCompanyWebhookMapper.toDomain(companyWebhook);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new DuplicateCompanyWebhookError();
      }
      throw error;
    }
  }

  async findByCompanyProfileId(
    companyProfileId: string,
  ): Promise<CompanyWebhook[]> {
    const rows = await this.prisma.companyWebhook.findMany({
      where: { companyProfileId, deletedAt: null },
      include: { webhook: true },
    });
    return rows.map((row) => PrismaCompanyWebhookMapper.toDomain(row));
  }

  async deleteByWebhookIdAndCompanyProfileId(
    webhookId: string,
    companyProfileId: string,
  ): Promise<void> {
    const existing = await this.prisma.companyWebhook.findUnique({
      where: {
        companyProfileId_webhookId: { companyProfileId, webhookId },
      },
    });

    if (!existing) {
      throw new CompanyWebhookNotFoundError();
    }

    if (existing.companyProfileId !== companyProfileId) {
      throw new CompanyWebhookNotAllowedError();
    }

    await this.prisma.companyWebhook.update({
      where: {
        companyProfileId_webhookId: { companyProfileId, webhookId },
      },
      data: { deletedAt: new Date() },
    });
  }

  async findByWebhookIdAndCompanyProfileId(
    webhookId: string,
    companyProfileId: string,
  ): Promise<CompanyWebhook | null> {
    const row = await this.prisma.companyWebhook.findUnique({
      where: { companyProfileId_webhookId: { companyProfileId, webhookId } },
      include: { webhook: true },
    });
    if (!row) {
      return null;
    }
    return PrismaCompanyWebhookMapper.toDomain(row);
  }
}
