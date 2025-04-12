import { Request, Response } from 'express';
import CardService from '../services/cardService';
import { formatErrorResponse } from '../utils/errorResponse';
import { sendErrorsToSlack } from '../utils/logErrorToSlack';

class CardController {
  static async addNewCard(req: Request, res: Response) {
    try {
      const result = await CardService.addNewCard(req.body);
      res.json(result);
    } catch (err) {
      await sendErrorsToSlack('failed to add new card', req.body, err, req);
      res.status(400).json(formatErrorResponse(err));
    }
  }

  static async getCardDetails(req: Request, res: Response) {
    try {
      const result = await CardService.getCardDetails(req.query);
      res.json(result);
    } catch (err) {
      await sendErrorsToSlack('failed to get card details', req.body, err, req);
      res.status(400).json(formatErrorResponse(err));
    }
  }

  static async deactivateCard(req: Request, res: Response) {
    try {
      const result = await CardService.deactivateCard(req.body);
      res.json(result);
    } catch (err) {
      await sendErrorsToSlack('failed to deactivate card', req.body, err, req);
      res.status(400).json(formatErrorResponse(err));
    }
  }

  static async updateCardDetails(req: Request, res: Response) {
    try {
      const result = await CardService.updateCardDetails(req.body);
      res.json(result);
    } catch (err) {
      await sendErrorsToSlack('failed to update card details', req.body, err, req);
      res.status(400).json(formatErrorResponse(err));
    }
  }
}

export default CardController;
