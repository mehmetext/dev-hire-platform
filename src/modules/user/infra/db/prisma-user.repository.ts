import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { TransactionContext } from 'src/shared/modules/unit-of-work/application/repositories/unit-of-work.repository';
import { CreateUserCommand } from '../../application/dtos/create-user.command';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../domain/errors';
import { UserRepository } from '../../domain/repositories/user.repository';
import { EmailVO } from '../../domain/value-objects/email.vo';
import { PrismaUserMapper } from './prisma-user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    command: CreateUserCommand,
    options?: { tx?: TransactionContext },
  ): Promise<User> {
    const client = (options?.tx ?? this.prisma) as PrismaService;

    const existingUser = await this.findByEmail(command.email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(command.password, 10);

    const created = await client.user.create({
      data: {
        email: command.email.value,
        password: hashedPassword,
        role: command.role,
      },
    });

    return PrismaUserMapper.toDomain({
      ...created,
    });
  }

  async findByEmail(email: EmailVO): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.value },
      include: {
        companyProfile: true,
        candidateProfile: true,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain({
      ...user,
      companyProfile: user.companyProfile ?? undefined,
      candidateProfile: user.candidateProfile ?? undefined,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        companyProfile: true,
        candidateProfile: true,
      },
    });
    if (!user) return null;

    return PrismaUserMapper.toDomain({
      ...user,
      companyProfile: user.companyProfile ?? undefined,
      candidateProfile: user.candidateProfile ?? undefined,
    });
  }

  async update(user: User): Promise<User> {
    const existingUser = await this.findById(user.id);

    if (!existingUser) {
      throw new UserNotFoundError();
    }

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email.value,
        password: user.password,
      },
      include: {
        companyProfile: true,
        candidateProfile: true,
      },
    });

    return PrismaUserMapper.toDomain({
      ...updated,
      companyProfile: updated.companyProfile ?? undefined,
      candidateProfile: updated.candidateProfile ?? undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
