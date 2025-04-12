import { Request, Response } from 'express';
import UserService from '../services/userService';
import { formatErrorResponse } from '../utils/errorResponse';
import { sendErrorsToSlack } from '../utils/logErrorToSlack';

class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const result = await UserService.createUser(req.body);
      res.json(result);
    } catch (err) {
      await sendErrorsToSlack('failed to create user', req.body, err, req);
      res.status(400).json(formatErrorResponse(err));
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const result = await UserService.getUser(req.query);
      res.json(result);
    } catch (err) {
      await sendErrorsToSlack('failed to get user', req.body, err, req);
      res.status(400).json(formatErrorResponse(err));
    }
  }

  static async DeleteUser(req: Request, res: Response) {
    try {
      const result = await UserService.softDelete(req.body);
      res.json(result);
    } catch (err) {
      await sendErrorsToSlack('failed to delete user', req.body, err, req);
      res.status(400).json(formatErrorResponse(err));
    }
  }
  static async updateUserData(req: Request, res: Response) {
    try {
      const result = await UserService.updatuser(req.body);
      res.json(result);
    } catch (err) {
      await sendErrorsToSlack('failed to update user', req.body, err, req);
      res.status(400).json(formatErrorResponse(err));
    }
  }
}

export default UserController;
