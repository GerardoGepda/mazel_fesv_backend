'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DocumentType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.DocumentType.hasMany(models.Customer, { foreignKey: 'documentTypeId', sourceKey: 'id'});
    }
  }
  DocumentType.init({
    name: DataTypes.STRING(50),
    codeMH: DataTypes.STRING(10),
    state: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DocumentType',
  });
  return DocumentType;
};