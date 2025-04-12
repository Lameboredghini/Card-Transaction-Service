import { BaseDao } from './baseDao';

interface CardData {
  id: string;
  name: string;
  email: string;
}

export class CardDataDao extends BaseDao<CardData> {
  constructor(accountNumber: string) {
    super('cardData', accountNumber);
  }
}
