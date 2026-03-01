import { Module } from '@nestjs/common';
import { CandidateRepository } from '../application/repositories/candidate.repository';
import { GetCvsByCandidateIdUseCase } from '../application/use-cases/get-cvs-by-candidate-id.use-case';
import { PrismaCandidateRepository } from './db/prisma-candidate.repository';
import { CandidateController } from './http/candidate.controller';

@Module({
  controllers: [CandidateController],
  imports: [],
  providers: [
    {
      provide: CandidateRepository,
      useClass: PrismaCandidateRepository,
    },
    GetCvsByCandidateIdUseCase,
  ],
  exports: [CandidateRepository],
})
export class CandidateModule {}
