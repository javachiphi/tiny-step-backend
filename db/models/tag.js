'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { entry, user } = models
      this.belongsToMany(entry, { through: 'entry_tags'})
      this.belongsToMany(user, { through: 'user_tags'})
    }
  }
  tag.init({
    note: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.STRING, // myers_briggs, CBT, user_generated
    personality: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tag',
    underscored: true,
  });
  return tag;
};