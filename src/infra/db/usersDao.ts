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

  async findUserByEmail(email: string) {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.email = @email',
      parameters: [
        {
          name: '@email',
          value: email,
        },
      ],
    };

    const data = await this.findByQuery(querySpec);
    return data;
  }
}
