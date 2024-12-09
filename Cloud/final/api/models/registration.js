const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Event = require('./event');

const Registration = sequelize.define('registration', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  number_of_tickets: { type: DataTypes.INTEGER, defaultValue: 1 },
  registration_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

Registration.belongsTo(User, { foreignKey: 'user_id' });
Registration.belongsTo(Event, { foreignKey: 'event_id' });
Registration.belongsTo(Event, { foreignKey: 'ticket_id' });

module.exports = Registration;
