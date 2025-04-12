import { Request, Response } from 'express';
import CardService from '../services/cardService';
import { formatErrorResponse } from '../utils/errorResponse';

class CardController {
  static async addNewCard(req: Request, res: Response) {
    try {
      const result = await CardService.addNewCard(req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json(formatErrorResponse(err));
    }
  }

  static async getCardDetails(req: Request, res: Response) {
    try {
      const result = await CardService.getCardDetails(req.query);
      res.json(result);
    } catch (err) {
      res.status(400).json(formatErrorResponse(err));
    }
  }

  static async deactivateCard(req: Request, res: Response) {
    try {
      const result = await CardService.deactivateCard(req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json(formatErrorResponse(err));
    }
  }

  static async updateCardDetails(req: Request, res: Response) {
    try {
      const result = await CardService.updateCardDetails(req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json(formatErrorResponse(err));
    }
  }
}

export default CardController;
