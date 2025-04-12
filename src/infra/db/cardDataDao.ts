import { BaseDao } from './baseDao';

interface User {
  id: string;
  name: string;
  email: string;
}

export class CardDataDao extends BaseDao<User> {
  constructor(accountNumber: string) {
    super('cardData', accountNumber);
  }
}
