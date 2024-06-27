'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Route.hasMany(models.Permission, { foreignKey: 'routeId', sourceKey: 'id' });
    }
  }
  Route.init({
    name: DataTypes.STRING(50),
    path: DataTypes.STRING(50),
    state: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Route',
  });
  return Route;
};