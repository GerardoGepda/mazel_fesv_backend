'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResetPassword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ResetPassword.belongsTo(models.User, {foreignKey: 'userId', targetKey: 'id'});
    }
  }
  ResetPassword.init({
    code: DataTypes.STRING(6),
    state: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ResetPassword',
  });
  return ResetPassword;
};