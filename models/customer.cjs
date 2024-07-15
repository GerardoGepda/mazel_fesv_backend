'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Customer.belongsTo(models.Activity, { foreignKey: 'activityId', targetKey: 'id' });
      models.Customer.belongsTo(models.Municipality, { foreignKey: 'municipalityId', targetKey: 'id' });
      models.Customer.belongsTo(models.DocumentType, { foreignKey: 'documentTypeId', targetKey: 'id' });
    }
  }
  Customer.init({
    oldId: DataTypes.STRING(50),
    documentNumber: DataTypes.STRING(50),
    name: DataTypes.STRING(200),
    comercialName: DataTypes.STRING(200),
    nrc: DataTypes.STRING(20),
    email: DataTypes.STRING(150),
    phone: DataTypes.STRING(50),
    address: DataTypes.TEXT,
    state: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};