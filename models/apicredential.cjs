'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApiCredential extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ApiCredential.init({
    name: DataTypes.STRING(50),
    code: DataTypes.STRING(20),
    url: DataTypes.TEXT,
    sandbox: DataTypes.INTEGER,
    state: DataTypes.INTEGER,
    user: DataTypes.STRING(50),
    password: DataTypes.STRING(50),
    token: DataTypes.TEXT,
    tokenExpire: DataTypes.BIGINT,
    response: DataTypes.TEXT,
    refreshToken: DataTypes.TEXT,
    refreshTokenExpire: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'ApiCredential',
  });
  return ApiCredential;
};