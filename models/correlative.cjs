'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Correlative extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Correlative.init({
    mask: DataTypes.STRING(7),
    name: DataTypes.STRING(50),
    codeMH: DataTypes.STRING(5),
    initial: DataTypes.INTEGER,
    actual: DataTypes.INTEGER,
    final: DataTypes.INTEGER,
    state: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Correlative',
  });
  return Correlative;
};