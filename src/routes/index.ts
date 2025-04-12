import { Router } from 'express';
import UserController from '../controllers/userController';
import CardController from '../controllers/cardDataController';

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

// router.post("/", TransactionController.createTransaction);
// router.get("/:id", TransactionController.getTransaction);
// router.get("/", TransactionController.getAllTransactions);
// router.patch("/:id", TransactionController.updateTransactionStatus);
// router.delete("/:id", TransactionController.deleteTransaction);

export default router;
