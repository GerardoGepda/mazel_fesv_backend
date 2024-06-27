'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Menu.hasMany(models.Submenu, { foreignKey: 'menuId', sourceKey: 'id'});
      models.Menu.hasMany(models.MenuRoute, { foreignKey: 'menuId', sourceKey: 'id', onDelete: 'CASCADE' });
    }
  }
  Menu.init({
    name: DataTypes.STRING(50),
    state: DataTypes.INTEGER,
    order: DataTypes.INTEGER,
    icon: DataTypes.STRING(50),
  }, {
    sequelize,
    modelName: 'Menu',
  });
  return Menu;
};