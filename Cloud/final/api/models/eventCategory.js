const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Event = require('./event');
const Category = require('./category');

const EventCategory = sequelize.define('eventCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

EventCategory.belongsTo(Event, { foreignKey: 'event_id' });
EventCategory.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = EventCategory;
