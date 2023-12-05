'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class entry extends Model {
    static associate(models) {
      // define association here
      const { user, tag } = models
      this.belongsTo(user, { foreignKey: 'user_id' })
      this.belongsToMany(tag, { through: 'entry_tags', foreignKey: 'entry_id', otherKey: 'tag_id'})
    }
  }
  entry.init({
    observation: DataTypes.TEXT,
    solution: DataTypes.TEXT,
    // userId: DataTypes.
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
  }, {
    sequelize,
    modelName: 'entry',
    underscored: true,
  });
  return entry;
};