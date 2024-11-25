'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Document.belongsTo(models.Customer, { foreignKey: 'customerId', targetKey: 'id' });
      models.Document.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
    }
  }
  Document.init({
    generationCode: DataTypes.STRING(50),
    controlNumber: DataTypes.STRING(50),
    receivedStamp: DataTypes.STRING(50),
    dteType: DataTypes.STRING(5),
    totalIva: DataTypes.DECIMAL(10, 2),
    dateEmitted: DataTypes.DATEONLY,
    dateProcessed: DataTypes.DATEONLY,
    state: DataTypes.INTEGER,
    timesSent: DataTypes.INTEGER,
    referenceId: DataTypes.INTEGER,
    dteJson: DataTypes.TEXT,
    mhResponse: DataTypes.TEXT,
    generationCodeInvl: DataTypes.STRING(50),
    receivedStampInvl: DataTypes.STRING(50),
    invalidationDate: DataTypes.DATEONLY,
    invalidationResponse: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Document',
  });
  return Document;
};