import { TransactionContext } from 'src/shared/modules/unit-of-work/application/repositories/unit-of-work.repository';
import { CreateUserCommand } from '../../application/dtos/create-user.command';
import { User } from '../entities/user.entity';
import { EmailVO } from '../value-objects/email.vo';

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
