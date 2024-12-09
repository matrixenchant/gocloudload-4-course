const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Event = require('./event');

const Ticket = sequelize.define('ticket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT },
  availability: { type: DataTypes.INTEGER },
});

Ticket.belongsTo(Event, { foreignKey: 'event_id' });

module.exports = Ticket;
