import { Request, Response } from 'express';
import UserService from '../services/userService';
import { formatErrorResponse } from '../utils/errorResponse';

class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const result = await UserService.createUser(req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json(formatErrorResponse(err));
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const result = await UserService.getUser(req.query);
      res.json(result);
    } catch (err) {
      res.status(400).json(formatErrorResponse(err));
    }
  }

  static async DeleteUser(req: Request, res: Response) {
    try {
      const result = await UserService.softDelete(req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json(formatErrorResponse(err));
    }
  }
  static async updateUserData(req: Request, res: Response) {
    try {
      const result = await UserService.updatuser(req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json(formatErrorResponse(err));
    }
  }
}

export default UserController;
