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
    }
  }
  Document.init({
    generationCode: DataTypes.STRING(50),
    controlNumber: DataTypes.STRING(50),
    receivedStamp: DataTypes.STRING(50),
    dteType: DataTypes.STRING(5),
    dateEmitted: DataTypes.DATEONLY,
    dateProcessed: DataTypes.DATEONLY,
    state: DataTypes.INTEGER,
    dteJson: DataTypes.TEXT,
    mhResponse: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Document',
  });
  return Document;
};