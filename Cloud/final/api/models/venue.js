const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Venue = sequelize.define('venue', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  capacity: { type: DataTypes.INTEGER },
  contact_info: { type: DataTypes.STRING },
});

module.exports = Venue;
