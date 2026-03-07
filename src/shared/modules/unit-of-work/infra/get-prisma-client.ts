import { PrismaService } from '../../prisma/prisma.service';

export function getPrismaClient(
  tx: unknown,
  fallback: PrismaService,
): PrismaService {
  return (tx ?? fallback) as PrismaService;
}
