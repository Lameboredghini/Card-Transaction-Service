import { v4 as uuidv4 } from 'uuid';
import { CardDataDao } from '../infra/db/cardDataDao';
import { TransactionsDao } from '../infra/db/transactionsDao';
import { UserDao } from '../infra/db/usersDao';
import CustomError from '../utils/customError';
import generateUUIDv5 from '../utils/uuid';
import validateEmail from '../utils/validateEmail';
import { ParsedQs } from 'qs';

class TransactionService {
  static async createTransaction(data: { email: string; cardId: string; transactionType: 'debit' | 'credit'; amount: number }) {
    const { email, cardId, transactionType, amount } = data;
    if (!email || !cardId || !transactionType || !amount) {
      throw new CustomError('ValidationError', 'email, cardId, transactionType and amount are required', {});
    }
    validateEmail(email);

    if (!['credit', 'debit'].includes(transactionType.toLowerCase())) {
      throw new CustomError('ValidationError', `Invalid transaction type. can only be debit or credit`, {
        transactionType,
      });
    }
    const id = generateUUIDv5(email);
    const userDao = new UserDao(id);
    const existingUser = await userDao.getData(id);
    if (!existingUser) {
      throw new CustomError('ValidationError', 'User does not exists! cannot create transaction', {
        email,
        ...existingUser,
      });
    }

    const cardDao = new CardDataDao(id);
    const existingCard = await cardDao.getData(cardId);
    if (!existingCard) {
      throw new CustomError('ValidationError', 'Card does not exists! cannot create transaction', {
        cardId,
        ...existingCard,
      });
    }

    if (existingCard.expirationDate < new Date()) {
      throw new CustomError('ValidationError', 'Card is expired! cannot create transaction', {
        cardId,
        ...existingCard,
      });
    }

    if (transactionType.toLowerCase() === 'debit' && existingCard.limit < amount) {
      throw new CustomError('ValidationError', 'Insufficient balance for debit transaction', {
        field: 'amount',
        expected: `<= ${existingCard.limit}`,
        received: amount,
      });
    }
    let cardData;
    if (transactionType.toLowerCase() === 'credit') {
      cardData = {
        limit: existingCard.limit + amount,
      };
    } else {
      cardData = {
        limit: existingCard.limit - amount,
      };
    }
    await cardDao.updateData(cardId, cardData);

    const transactionDao = new TransactionsDao(id);
    const transaction = {
      id: uuidv4(),
      cardId,
      transactionType,
      amount,
      updatedBalance: cardData.limit,
      userId: id,
      status: 'pending',
      createdAt: new Date(),
    };
    await transactionDao.createData(transaction);

    return {
      transactionId: transaction.id,
      status: 'pending',
      updatedBalance: transaction.updatedBalance,
    };
  }

  static async updateTransactionStatus(data: { transactionId: string; status: string; email: string }) {
    const { transactionId, status, email } = data;
    if (!transactionId || !status || !email) {
      throw new CustomError('ValidationError', 'email, transactionId and status are required', {});
    }
    validateEmail(email);

    const id = generateUUIDv5(email);
    if (['failed,', 'refunded', 'approved', 'pending'].includes(status.toLowerCase()) === false) {
      throw new CustomError('ValidationError', `Invalid status. can only be one of failed, refunded, approved or pending`, {
        status,
      });
    }

    const userDao = new UserDao(id);
    const existingUser = await userDao.getData(id);
    if (!existingUser) {
      throw new CustomError('ValidationError', 'User does exists!! cannot update something that does not exist', {
        email,
        ...existingUser,
      });
    }

    const transactionDao = new TransactionsDao(id);
    const existingTransaction = await transactionDao.getData(transactionId);
    if (!existingTransaction) {
      throw new CustomError('ValidationError', 'Transaction does not exists! cannot update transaction', {
        transactionId,
        ...existingTransaction,
      });
    }
    const updates = {
      status: status.toLowerCase(),
      updatedOn: new Date(),
    };

    const updatedTransaction = await transactionDao.updateData(transactionId, { ...updates });

    return {
      message: 'Transaction status updated successfully to ' + status,
      transactionId: updatedTransaction.id,
      status: 200,
      properties: updatedTransaction,
    };
  }

  static async deleteTransaction(data: { transactionId: string; email: string }) {
    const { transactionId, email } = data;
    if (!transactionId || !email) {
      throw new CustomError('ValidationError', 'email and transactionId are required', {});
    }
    validateEmail(email);

    const id = generateUUIDv5(email);

    const userDao = new UserDao(id);
    const existingUser = await userDao.getData(id);
    if (!existingUser) {
      throw new CustomError('ValidationError', 'User does exists!! cannot update something that does not exist', {
        email,
        ...existingUser,
      });
    }

    const transactionDao = new TransactionsDao(id);
    const existingTransaction = await transactionDao.getData(transactionId);
    if (!existingTransaction) {
      throw new CustomError('ValidationError', 'Transaction does not exists/already deleted! cannot update transaction', {
        transactionId,
        ...existingTransaction,
      });
    }

    if (existingTransaction.status?.toLowerCase() !== 'pending') {
      throw new CustomError('ValidationError', 'Cannot delete transaction that is not pending', {
        transactionId,
        ...existingTransaction,
      });
    }
    const updates = {
      deleted: true,
      updatedOn: new Date(),
    };

    const updatedTransaction = await transactionDao.updateData(transactionId, { ...updates });

    return {
      message: 'Transaction deleted successfully ',
      transactionId: updatedTransaction.id,
      status: 200,
      properties: updatedTransaction,
    };
  }

  static async getTransactions(queryData: ParsedQs) {
    const cardId = queryData.cardId as string;
    const email = queryData.email as string;
    const startDate = queryData.startDate as string;
    const endDate = queryData.endDate as string;
    const type = queryData.type as string;
    if (!cardId || !email) {
      throw new CustomError('ValidationError', 'cardId and email are required', {});
    }
    if (!['credit', 'debit'].includes(type.toLowerCase())) {
      throw new CustomError('ValidationError', `Invalid transaction type. can only be debit or credit`, {
        type,
      });
    }
    validateEmail(email);
    const userId = generateUUIDv5(email);

    const transactionDao = new TransactionsDao(userId);
    const transactions = await transactionDao.findTransactionsByCard(cardId, startDate, endDate, type);

    return {
      transactions,
    };
  }

  static async getTransaction(queryData: ParsedQs) {
    const transactionId = queryData.transactionId as string;
    const email = queryData.email as string;
    if (!transactionId || !email) {
      throw new CustomError('ValidationError', 'transactionId and email are required', {});
    }
    validateEmail(email);
    const userId = generateUUIDv5(email);

    const transactionDao = new TransactionsDao(userId);
    const transaction = await transactionDao.getData(transactionId);

    if (!transaction) {
      throw new CustomError('NotFoundError', 'Transaction not found', { transactionId });
    }

    return transaction;
  }
}

export default TransactionService;
