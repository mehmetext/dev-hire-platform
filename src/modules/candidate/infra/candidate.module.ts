import { Module } from '@nestjs/common';
import { CandidateRepository } from '../application/repositories/candidate.repository';
import { PrismaCandidateRepository } from './db/prisma-candidate.repository';

@Module({
  controllers: [],
  imports: [],
  providers: [
    {
      provide: CandidateRepository,
      useClass: PrismaCandidateRepository,
    },
  ],
  exports: [CandidateRepository],
})
export class CandidateModule {}
