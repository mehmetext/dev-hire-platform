import { Module } from '@nestjs/common';
import { CandidateRepository } from '../application/repositories/candidate.repository';
import { CreateCandidateCvUseCase } from '../application/use-cases/create-candidate-cv.use-case';
import { DeleteCandidateCvUseCase } from '../application/use-cases/delete-candidate-cv.use-case';
import { GetCvsByCandidateIdUseCase } from '../application/use-cases/get-cvs-by-candidate-id.use-case';
import { UpdateCandidateCvUseCase } from '../application/use-cases/update-candidate-cv.use-case';
import { UpdateCandidateProfileUseCase } from '../application/use-cases/update-candidate-profile.use-case';
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
    CreateCandidateCvUseCase,
    UpdateCandidateCvUseCase,
    DeleteCandidateCvUseCase,
    UpdateCandidateProfileUseCase,
  ],
  exports: [CandidateRepository],
})
export class CandidateModule {}
