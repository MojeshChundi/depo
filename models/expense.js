const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Expense = sequelize.define("expenses", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  spentAmount: Sequelize.STRING,
  Description: Sequelize.STRING,
  category: Sequelize.STRING,
});

module.exports = Expense;
