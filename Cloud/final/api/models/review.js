const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Event = require('./event');
const User = require('./user');

const Review = sequelize.define('review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.STRING },
});

Review.belongsTo(Event, { foreignKey: 'event_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Review;
