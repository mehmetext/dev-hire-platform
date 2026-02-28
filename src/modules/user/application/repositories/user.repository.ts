import { TransactionContext } from 'src/shared/modules/unit-of-work/application/repositories/unit-of-work.repository';
import { User } from '../../domain/entities/user.entity';
import { EmailVO } from '../../domain/value-objects/email.vo';
import { CreateUserCommand } from '../dtos/create-user.command';

export abstract class UserRepository {
  abstract create(
    command: CreateUserCommand,
    options?: { tx?: TransactionContext },
  ): Promise<User>;
  abstract findByEmail(email: EmailVO): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract update(user: User): Promise<User>;
  abstract delete(id: string): Promise<void>;
}
