const sequelize = require('sequelize');
const Expense = require('../models/expense');
const User = require('../models/user');

exports.premUser =
  ('/user/premuser',
  async (req, res, next) => {
    try {
      const result = await User.findAll({
        attributes: ['name', 'totalExpense'],

        order: [['totalExpense', 'DESC']],
      });

      res.status(201).json({ userDetails: result });
    } catch (err) {
      res.status(400).json({ message: 'premuser route error' });
    }
  });
