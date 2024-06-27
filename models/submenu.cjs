'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Submenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Submenu.hasMany(models.MenuRoute, { foreignKey: 'submenuId', sourceKey: 'id' });
      models.Submenu.belongsTo(models.Menu, { foreignKey: 'menuId', targetKey: 'id' });
    }
  }
  Submenu.init({
    name: DataTypes.STRING(50),
    state: DataTypes.INTEGER,
    order: DataTypes.INTEGER,
    icon: DataTypes.STRING(50),
  }, {
    sequelize,
    modelName: 'Submenu',
  });
  return Submenu;
};