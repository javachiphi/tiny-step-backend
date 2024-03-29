'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class entry extends Model {
    static associate(models) {
      // define association here
      const { user, tag } = models
      this.belongsTo(user)
      this.belongsToMany(tag, { 
        through: 'entry_tags',  
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE', 
        foreignKey: 'entry_id', 
        otherKey: 'tag_id'
      })
    
    
    }
  }
  entry.init({
    observation: DataTypes.TEXT,
    solution: DataTypes.TEXT,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'entry',
    underscored: true,
  });
  return entry;
};