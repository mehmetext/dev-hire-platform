import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  TransactionContext,
  UnitOfWorkRepository,
} from '../application/repositories/unit-of-work.repository';

@Injectable()
export class PrismaUnitOfWorkRepository implements UnitOfWorkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async execute<T>(work: (tx: TransactionContext) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(work);
  }
}
