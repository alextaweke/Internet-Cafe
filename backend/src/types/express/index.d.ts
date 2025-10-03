import { User } from '../../models/interfaces';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, 'id' | 'username' | 'role'>;
    }
  }
}
