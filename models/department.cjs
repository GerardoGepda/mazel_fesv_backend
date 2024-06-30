'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Department.hasMany(models.Municipality, { foreignKey: 'departmentId', sourceKey: 'id' });
    }
  }
  Department.init({
    name: DataTypes.STRING(50),
    codeMH: DataTypes.STRING(10),
    state: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Department',
  });
  return Department;
};