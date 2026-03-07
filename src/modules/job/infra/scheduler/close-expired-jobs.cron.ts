import { Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CloseExpiredJobsUseCase } from '../../application/use-cases/close-expired-jobs.use-case';

export class CloseExpiredJobsCron {
  constructor(
    @Inject(CloseExpiredJobsUseCase)
    private readonly closeExpiredJobsUseCase: CloseExpiredJobsUseCase,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async execute() {
    console.log('Closing expired jobs');
    await this.closeExpiredJobsUseCase.execute();
  }
}
