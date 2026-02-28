import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from 'src/modules/user/application/repositories/user.repository';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { EmailVO } from 'src/modules/user/domain/value-objects/email.vo';

export class ValidateUserUseCase {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async execute(email: EmailVO, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
