const Sequelize = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PWD,
  {
    host: process.env.HOST,
    dialect: 'mysql',
  }
);

module.exports = sequelize;
