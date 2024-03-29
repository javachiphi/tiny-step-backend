'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    static associate(models) {
      // define association here
      const { entry, user } = models
      this.belongsToMany(entry, { 
        through: 'entry_tags',
        foreignKey: 'tag_id', 
        otherKey: 'entry_id'
      })
      this.belongsToMany(user, { 
        through: 'user_tags',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        foreignKey: 'tag_id',
        otherKey: 'user_id'
      })
    }
  }
  tag.init({
    note: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.STRING, // myers_briggs, CBT, user_generated
    personality: DataTypes.STRING,
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tag',
    underscored: true,
  });
  return tag;
};