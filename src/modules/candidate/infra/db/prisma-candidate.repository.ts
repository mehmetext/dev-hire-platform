import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { TransactionContext } from 'src/shared/modules/unit-of-work/application/repositories/unit-of-work.repository';
import { CandidateRepository } from '../../application/repositories/candidate.repository';
import { CandidateProfile } from '../../domain/entities/candidate-profile.entity';
import { PrismaCandidateMapper } from './prisma-candidate.mapper';

@Injectable()
export class PrismaCandidateRepository implements CandidateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    candidateProfile: CandidateProfile,
    options?: { tx?: TransactionContext },
  ): Promise<CandidateProfile> {
    const client = (options?.tx ?? this.prisma) as PrismaService;

    const created = await client.candidateProfile.create({
      data: PrismaCandidateMapper.toCreatePersistence(candidateProfile),
    });

    return PrismaCandidateMapper.toDomain(created);
  }

  async findById(id: string): Promise<CandidateProfile | null> {
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { id },
    });
    if (!candidateProfile) return null;

    return PrismaCandidateMapper.toDomain(candidateProfile);
  }

  async update(candidateProfile: CandidateProfile): Promise<CandidateProfile> {
    const updated = await this.prisma.candidateProfile.update({
      where: { id: candidateProfile.id },
      data: PrismaCandidateMapper.toUpdatePersistence(candidateProfile),
    });
    return PrismaCandidateMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.candidateProfile.delete({
      where: { id },
    });
  }
}
