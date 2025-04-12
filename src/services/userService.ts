import { UserDao } from '../infra/db/usersDao';
import CustomError from '../utils/customError';
import generateUUIDv5 from '../utils/uuid';
import validateEmail from '../utils/validateEmail';
import { ParsedQs } from 'qs';

class UserService {
  static async getUser(queryData: ParsedQs) {
    const email = queryData.email as string;
    if (!email) {
      throw new CustomError('ValidationError', 'email and card are required', {});
    }
    validateEmail(email);

    const id = generateUUIDv5(email);
    const userDao = new UserDao(id);
    const userData = await userDao.getData(id);
    if (!userData) {
      throw new CustomError('NotFoundError', 'User not found or user deleted', {});
    }

    return {
      message: 'Data retrieved successfully',
      accountNumber: userData.id,
      status: 200,
      properties: userData,
    };
  }
  static async createUser(data: { email: string; name: string }) {
    const { email, name } = data;
    if (!email || !name) {
      throw new CustomError('ValidationError', 'email and name are required', {});
    }
    validateEmail(email);

    const id = generateUUIDv5(email);
    const userDao = new UserDao(id);
    const existingUser = await userDao.getData(id);
    if (existingUser) {
      throw new CustomError('ValidationError', 'User already exists', {
        email,
        ...existingUser,
      });
    }
    const user = {
      id,
      accountNumber: id,
      createdAt: new Date(),
      ...data,
    };
    const userData = await userDao.createData(user);

    return {
      message: 'User created successfully',
      accountNumber: userData.id,
      status: 200,
      properties: userData,
    };
  }

  static async updatuser(data: { email: string; updates: Object }) {
    const { email, updates } = data;
    if (!email) {
      throw new CustomError('ValidationError', 'emailis required', {});
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new CustomError('ValidationError', 'updates are required', {});
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
    const userData = await userDao.updateData(id, { ...updates });

    return {
      message: 'User updated successfully',
      accountNumber: userData.id,
      status: 200,
      properties: userData,
    };
  }

  static async softDelete(data: { email: string }) {
    const { email } = data;
    if (!email) {
      throw new CustomError('ValidationError', 'emailis required', {});
    }
    validateEmail(email);

    const id = generateUUIDv5(email);
    const userDao = new UserDao(id);
    const existingUser = await userDao.getData(id);
    if (!existingUser) {
      throw new CustomError('ValidationError', 'User does exists!! cannot delete something that does not exist', {
        email,
        ...existingUser,
      });
    }
    const userData = await userDao.softDelete(id);

    return {
      message: 'User deleted successfully',
      accountNumber: userData.id,
      status: 200,
      properties: userData,
    };
  }
}

export default UserService;
