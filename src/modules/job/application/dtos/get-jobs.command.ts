import { WorkType } from '../../domain/enums/work-type.enum';

export class GetJobsCommand {
  constructor(
    public readonly query: string | undefined,
    public readonly workType: WorkType | undefined,
  ) {}
}
