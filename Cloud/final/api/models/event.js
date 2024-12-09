const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Event = sequelize.define('event', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  date_time: { type: DataTypes.DATE, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
});

Event.belongsTo(User, { foreignKey: 'created_by' });
User.hasMany(Event, { foreignKey: 'created_by' });

module.exports = Event;
