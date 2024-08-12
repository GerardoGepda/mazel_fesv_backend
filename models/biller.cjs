'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Biller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Biller.belongsTo(models.Municipality, { foreignKey: 'municipalityId', targetKey: 'id' });
    }
  }
  Biller.init({
    name: DataTypes.STRING(200),
    comercialName: DataTypes.STRING(200),
    nit: DataTypes.STRING(14),
    nrc: DataTypes.STRING(10),
    activity: DataTypes.TEXT,
    activityCode: DataTypes.STRING(10),
    address: DataTypes.TEXT,
    phone: DataTypes.STRING(15),
    email: DataTypes.STRING(150),
    state: DataTypes.INTEGER,
    establishmentType: DataTypes.STRING(2),
    establishmentCode: DataTypes.STRING(4),
    posCode: DataTypes.STRING(4),
  }, {
    sequelize,
    modelName: 'Biller',
  });
  return Biller;
};