const jwt = require('jsonwebtoken');
require('dotenv').config();
const Expense = require('../models/expense');
const User = require('../models/user');
const UserServices = require('../sevices/usersevises');
const S3Services = require('../sevices/S3sevices');
const sequelize = require('../utils/database');

exports.downloadExpense = async (req, res, next) => {
  const expenses = await UserServices.getExpenses(req);
  const stringifiedExpense = JSON.stringify(expenses);

  //we need to update the file name every time we upload new file that we dont want rewrite old file
  const userId = req.user.id;
  const filename = `Expense${userId}/${new Date()}.txt`;
  const fileURl = await S3Services.uploadToS3(stringifiedExpense, filename);
  res.status(200).json({ fileURl, success: true });
};

exports.addExpense = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const userId = req.user.id;
    const spentAmount = req.body.spentAmount;
    const Description = req.body.Description;
    const category = req.body.category;
    const data = await Expense.create(
      {
        spentAmount,
        Description,
        category,
        userId,
      },
      t
    );
    const totalAmount = Number(req.user.totalExpense) + Number(spentAmount);
    await User.update(
      { totalExpense: totalAmount },
      { where: { id: userId } },
      t
    );
    await t.commit();
    res.status(201).json({ data: data });
  } catch (err) {
    if (t) await t.rollback();
    console.log(err);
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    //console.log(req.headers);
    const userId = req.user.id;
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 3;
    const offset = (page - 1) * limit;
    const totalItems = await Expense.count({ where: { userId: userId } });
    const expenses = await Expense.findAll({
      offset,
      limit: limit,
      where: { userId: userId },
    });
    res.json({
      data: expenses,
      currentPage: page,
      hasNextPage: limit * page < totalItems,
      nextPage: page + 1,
      hasPrevousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const ExpenseId = req.body.id;
    const userId = req.user.id;
    const spentAmount = req.body.spentAmount;
    const expense = await Expense.findById(ExpenseId);
    await expense.destroy();
    const totalAmount = Number(req.user.totalExpense) - Number(spentAmount);
    await User.update({ totalExpense: totalAmount }, { where: { id: userId } });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const totalExpense = req.user.totalExpense;
    const ExpenseId = req.body.id;
    const amount = req.body.amount;
    const spentAmount = req.body.spentAmount;
    const Description = req.body.Description;
    const category = req.body.category;
    const expense = await Expense.findById(ExpenseId);
    await expense.update({
      spentAmount,
      Description,
      category,
    });
    const totalAmount =
      Number(totalExpense) + Number(spentAmount) - Number(amount);
    await User.update({ totalExpense: totalAmount }, { where: { id: userId } });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
