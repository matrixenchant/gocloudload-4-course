const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Event = require('./event');

const Notification = sequelize.define('n1otification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  message: { type: DataTypes.STRING },
  sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

Notification.belongsTo(User, { foreignKey: 'user_id' });
Notification.belongsTo(Event, { foreignKey: 'event_id' });

module.exports = Notification;
