import { CardCategory } from '../enums/cardCategories.enum';
import { v4 as uuidv4 } from 'uuid';
import { CardDataDao } from '../infra/db/cardDataDao';
import { UserDao } from '../infra/db/usersDao';
import CustomError from '../utils/customError';
import generateCreditCard from '../utils/generateCreditCard';
import generateUUIDv5 from '../utils/uuid';
import validateEmail from '../utils/validateEmail';
import { ParsedQs } from 'qs';

class CardService {
  static async getCardDetails(queryData: ParsedQs) {
    const email = queryData.email as string;
    const cardId = queryData.cardId as string;
    if (!email || !cardId) {
      throw new CustomError('ValidationError', 'email and cardId are required', {});
    }
    validateEmail(email);

    const accountNumber = generateUUIDv5(email);
    const userDao = new UserDao(accountNumber);
    const existingUser = await userDao.getData(accountNumber);
    if (!existingUser) {
      throw new CustomError('ValidationError', 'User does not exists', {
        email,
      });
    }
    const cardDataDao = new CardDataDao(accountNumber);
    const userData = await cardDataDao.getData(cardId);
    if (!userData) {
      throw new CustomError('NotFoundError', 'no card found for the user', {
        cardId,
        accountNumber,
        email,
      });
    }

    return {
      message: 'Data retrieved successfully',
      accountNumber,
      status: 200,
      properties: userData,
    };
  }

  static async addNewCard(data: { email: string; cardLimit: number; cardCategory: string; cardType?: string; validityYears?: number }) {
    const { email } = data;
    if (!email || !data.cardLimit || !data.cardCategory) {
      throw new CustomError('ValidationError', 'valid email, card category and card limit is required', {});
    }
    if (!Object.values(CardCategory).includes(data?.cardCategory as CardCategory)) {
      throw new CustomError('ValidationError', 'INVALID CARD CATEGORY', {
        data,
      });
    }
    validateEmail(email);

    const accountNumber = generateUUIDv5(email);
    const userDao = new UserDao(accountNumber);
    const existingUser = await userDao.getData(accountNumber);
    if (!existingUser) {
      throw new CustomError('ValidationError', 'User does not exists, you can only add cards to existing users', {
        email,
      });
    }

    const generatedCardDetails = generateCreditCard(accountNumber, data.cardLimit, data.validityYears);
    const cardId = uuidv4();
    const dataToAdd = {
      id: cardId,
      cardId,
      userId: accountNumber,
      accountNumber: existingUser.accountNumber,
      cardHolderName: existingUser.name,
      createdAt: new Date(),
      cardType: data.cardType,
      cardCategory: data.cardCategory,
      ...generatedCardDetails,
    };
    const cardDetailsDao = new CardDataDao(accountNumber);
    const cardData = await cardDetailsDao.createData(dataToAdd);

    return {
      message: 'card created successfully',
      accountNumber: existingUser.accountNumber,
      status: 200,
      properties: cardData,
    };
  }

  static async deactivateCard(data: { email: string; cardId: string }) {
    const { email, cardId } = data;
    if (!email) {
      throw new CustomError('ValidationError', 'valid email is required', {});
    }
    validateEmail(email);

    const accountNumber = generateUUIDv5(email);
    const userDao = new UserDao(accountNumber);
    const existingUser = await userDao.getData(accountNumber);
    if (!existingUser) {
      throw new CustomError('ValidationError', 'User does not exists, you can only add cards to existing users', {
        email,
      });
    }
    const cardDetailsDao = new CardDataDao(accountNumber);
    const existingCardData = await cardDetailsDao.getData(cardId);
    if (!existingCardData) {
      throw new CustomError('NotFoundError', 'no card found for the user. Cannot delete something that does not exist', {
        cardId,
        accountNumber,
        email,
      });
    }
    const cardData = await cardDetailsDao.softDelete(cardId);

    return {
      message: 'card deactivated successfully',
      accountNumber: existingUser.accountNumber,
      status: 200,
      properties: cardData,
    };
  }

  static async updateCardDetails(data: { email: string; cardId: string; updates: Object }) {
    const { email, cardId, updates } = data;
    if (!email) {
      throw new CustomError('ValidationError', 'valid email is required', {});
    }
    if (!updates || Object.keys(updates).length === 0) {
      throw new CustomError('ValidationError', 'updates are required', {});
    }
    validateEmail(email);

    const accountNumber = generateUUIDv5(email);
    const userDao = new UserDao(accountNumber);
    const existingUser = await userDao.getData(accountNumber);
    if (!existingUser) {
      throw new CustomError('ValidationError', 'User does not exists, you can only add cards to existing users', {
        email,
      });
    }
    const cardDetailsDao = new CardDataDao(accountNumber);
    const existingCardData = await cardDetailsDao.getData(cardId);
    if (!existingCardData) {
      throw new CustomError('NotFoundError', 'no card found for the user', {
        cardId,
        accountNumber,
        email,
      });
    }
    const cardData = await cardDetailsDao.updateData(cardId, updates);

    return {
      message: 'card data updated successfully',
      accountNumber: existingUser.accountNumber,
      status: 200,
      properties: cardData,
    };
  }
}

export default CardService;
