'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Municipality extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Municipality.belongsTo(models.Department, { foreignKey: 'departmentId', targetKey: 'id' });
      models.Municipality.hasMany(models.Customer, { foreignKey: 'municipalityId', sourceKey: 'id' });
      models.Municipality.hasMany(models.Biller, { foreignKey: 'municipalityId', sourceKey: 'id' });
    }
  }
  Municipality.init({
    name: DataTypes.STRING(50),
    codeMH: DataTypes.STRING(10),
    state: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Municipality',
  });
  return Municipality;
};