'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class entry extends Model {
    static associate(models) {
      // define association here
      this.belongsToMany(models.tag, { through: 'entry_tags'})
    }
  }
  entry.init({
    observation: DataTypes.TEXT,
    solution: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'entry',
    underscored: true,
  });
  return entry;
};