import { Injectable } from '@nestjs/common';

export type TransactionContext = unknown;

@Injectable()
export abstract class UnitOfWorkRepository {
  abstract execute<T>(work: (tx: TransactionContext) => Promise<T>): Promise<T>;
}
