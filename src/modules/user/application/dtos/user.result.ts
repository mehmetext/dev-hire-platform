import { UserRole } from '../../domain/enums/user-role.enum';

export class UserResult {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
