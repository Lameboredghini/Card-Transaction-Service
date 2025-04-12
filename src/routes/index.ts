import { Router } from 'express';
import UserController from '../controllers/userController';
import CardController from '../controllers/cardDataController';
import TransactionController from '../controllers/transactionsController';

const router = Router();

// user routs
router.post('/users/create', UserController.createUser);
router.get('/users/', UserController.getUser);
router.post('/users/delete', UserController.DeleteUser);
router.post('/users/update', UserController.updateUserData);

// cards routes

router.post('/cards/create', CardController.addNewCard);
router.get('/cards/', CardController.getCardDetails);
router.post('/cards/deactivate', CardController.deactivateCard);
router.post('/cards/update', CardController.updateCardDetails);

// transaction routes

router.post('/transactions/create', TransactionController.createTransaction);
router.post('/transactions/update', TransactionController.updateTransactionStatus);
router.post('/transactions/delete', TransactionController.deletePendingTransaction);
router.get('/transaction', TransactionController.getTransaction);
router.get('/transactions/', TransactionController.getTransactions);

export default router;
