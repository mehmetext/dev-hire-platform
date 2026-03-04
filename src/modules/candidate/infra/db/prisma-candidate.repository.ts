import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { TransactionContext } from 'src/shared/modules/unit-of-work/application/repositories/unit-of-work.repository';
import { CandidateRepository } from '../../application/repositories/candidate.repository';
import { CandidateCV } from '../../domain/entities/candidate-cv.entity';
import { CandidateProfile } from '../../domain/entities/candidate-profile.entity';
import { PrismaCandidateCvMapper } from './prisma-candidate-cv.mapper';
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

  async findCvsByCandidateId(candidateId: string): Promise<CandidateCV[]> {
    const cvs = await this.prisma.candidateCV.findMany({
      where: { candidateProfileId: candidateId, deletedAt: null },
    });
    return cvs.map((cv) => PrismaCandidateCvMapper.toDomain(cv));
  }

  async findCvById(id: string): Promise<CandidateCV | null> {
    const cv = await this.prisma.candidateCV.findUnique({
      where: { id, deletedAt: null },
    });
    if (!cv) return null;
    return PrismaCandidateCvMapper.toDomain(cv);
  }

  async createCv(params: {
    candidateProfileId: string;
    title?: string;
    url: string;
  }): Promise<CandidateCV> {
    const created = await this.prisma.candidateCV.create({
      data: {
        candidateProfileId: params.candidateProfileId,
        title: params.title ?? undefined,
        url: params.url,
      },
    });

    return PrismaCandidateCvMapper.toDomain(created);
  }

  async updateCv(params: {
    id: string;
    candidateProfileId: string;
    title?: string;
    url: string;
  }): Promise<CandidateCV> {
    const updated = await this.prisma.candidateCV.update({
      where: { id: params.id },
      data: {
        candidateProfileId: params.candidateProfileId,
        title: params.title ?? undefined,
        url: params.url,
      },
    });

    return PrismaCandidateCvMapper.toDomain(updated);
  }

  async deleteCv(id: string): Promise<void> {
    await this.prisma.candidateCV.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
