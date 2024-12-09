require('dotenv').config();
const { Sequelize } = require('sequelize');

const isDEV = process.env.IS_DEV === 'true';

const sequelize = new Sequelize({
  host: isDEV ? '34.81.124.228' : process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  dialect: 'postgres',
});

module.exports = sequelize;
