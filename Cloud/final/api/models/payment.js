const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Registration = require('./registration');

const Payment = sequelize.define('payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  amount: { type: DataTypes.FLOAT },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  payment_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

Payment.belongsTo(Registration, { foreignKey: 'registration_id' });

module.exports = Payment;
