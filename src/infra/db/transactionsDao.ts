import { BaseDao } from './baseDao';

interface Transactions {
  id: string;
  name: string;
  email: string;
}

export class TransactionsDao extends BaseDao<Transactions> {
  constructor(accountNumber: string) {
    super('transactions', accountNumber);
  }

  async findTransactionsByCard(cardId: string, startDate?: string, endDate?: string, type?: string) {
    let query = 'SELECT * FROM c WHERE c.cardId = @cardId';
    const parameters = [{ name: '@cardId', value: cardId }];

    if (startDate) {
      const startDateString = new Date(startDate).toISOString();
      query += ' AND c.createdAt >= @startDate';
      parameters.push({ name: '@startDate', value: startDateString });
    }

    if (endDate) {
      const endDateString = new Date(endDate).toISOString();
      query += ' AND c.createdAt <= @endDate';
      parameters.push({ name: '@endDate', value: endDateString });
    }
    if (type) {
      query += ' AND c.transactionType = @type';
      parameters.push({ name: '@type', value: type });
    }
    const querySpec = { query, parameters };
    const data = await this.findByQuery(querySpec);
    return data;
  }
}
