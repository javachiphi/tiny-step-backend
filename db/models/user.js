'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      const { entry, tag } = models
      this.hasMany(entry);
      this.belongsToMany(tag, { through: 'user_tags'});
    }
  }
  user.init({
    email: DataTypes.STRING,
    jwtSub: DataTypes.STRING,
    personality: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
    underscored: true,
  });
  return user;
};