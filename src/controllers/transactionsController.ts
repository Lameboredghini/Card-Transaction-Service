import { Request, Response } from 'express';

import { formatErrorResponse } from '../utils/errorResponse';
import TransactionService from '../services/transactionService';
import { sendErrorsToSlack } from '../utils/logErrorToSlack';

class TransactionController {
  static async createTransaction(req: Request, res: Response) {
    try {
      const result = await TransactionService.createTransaction(req.body);
      res.json(result);
    } catch (err) {
      await sendErrorsToSlack('failed to create transaction', req.body, err, req);
      res.status(400).json(formatErrorResponse(err));
    }
  }

  static async deletePendingTransaction(req: Request, res: Response) {
    try {
      const result = await TransactionService.deleteTransaction(req.body);
      res.json(result);
    } catch (err) {
      await sendErrorsToSlack('failed to delete transaction', req.body, err, req);
      res.status(400).json(formatErrorResponse(err));
    }
  }
  static async updateTransactionStatus(req: Request, res: Response) {
    try {
      const result = await TransactionService.updateTransactionStatus(req.body);
      res.json(result);
    } catch (err) {
      await sendErrorsToSlack('failed to update transaction status', req.body, err, req);
      res.status(400).json(formatErrorResponse(err));
    }
  }

  static async getTransaction(req: Request, res: Response) {
    try {
      const result = await TransactionService.getTransaction(req.query);
      res.json(result);
    } catch (err) {
      await sendErrorsToSlack('failed to get transaction', req.body, err, req);
      res.status(400).json(formatErrorResponse(err));
    }
  }

  static async getTransactions(req: Request, res: Response) {
    try {
      const result = await TransactionService.getTransactions(req.query);
      res.json(result);
    } catch (err) {
      await sendErrorsToSlack('failed to get transactions', req.body, err, req);
      res.status(400).json(formatErrorResponse(err));
    }
  }
}

export default TransactionController;
