'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MenuRoute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.MenuRoute.belongsTo(models.Menu, { foreignKey: 'menuId', targetKey: 'id' });
      models.MenuRoute.belongsTo(models.Submenu, { foreignKey: 'submenuId', targetKey: 'id', allowNull: true});
      models.MenuRoute.belongsTo(models.Route, { foreignKey: 'routeId', targetKey: 'id' });
    }
  }
  MenuRoute.init({
    state: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'MenuRoute',
  });
  return MenuRoute;
};