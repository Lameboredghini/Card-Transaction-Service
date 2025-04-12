import { BaseDao } from './baseDao';

interface User {
  id: string;
  name: string;
  email: string;
}

export class UserDao extends BaseDao<User> {
  constructor(id: string) {
    super('users', id);
  }
}
