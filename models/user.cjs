'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsTo(models.Role, { foreignKey: 'roleId', targetKey: 'id' });
      models.User.hasMany(models.ResetPassword, {foreignKey: 'userId', sourceKey: 'id'});
      models.User.hasMany(models.Document, {foreignKey: 'userId', sourceKey: 'id'});
    }
  }
  User.init({
    firstName: DataTypes.STRING(50),
    lastName: DataTypes.STRING(50),
    dui: DataTypes.STRING(10),
    email: DataTypes.STRING(100),
    password: DataTypes.STRING(100),
    state: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};