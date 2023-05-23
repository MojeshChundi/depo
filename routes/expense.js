const express = require('express');
const AuthConttroller = require('../middleware/auth');
const expenseController = require('../controllers/expense');
const router = express.Router();

//ADD EXPENSE

router.post(
  '/user/add-Expense',
  AuthConttroller.Authenticate,
  expenseController.addExpense
);

//GET ALL EXPENSES

router.get(
  '/user/get-Expense',
  AuthConttroller.Authenticate,
  expenseController.getExpenses
);

// DELETE EXPENSE

router.post(
  '/user/delete-Expense',
  AuthConttroller.Authenticate,
  expenseController.deleteExpense
);

// UPDATE EXPENSE
router.post(
  '/user/update-Expense',
  AuthConttroller.Authenticate,
  expenseController.updateExpense
);

//DOWNLOAD EXPENSES

router.get(
  '/user/downloadfile',
  AuthConttroller.Authenticate,
  expenseController.downloadExpense
);

module.exports = router;
