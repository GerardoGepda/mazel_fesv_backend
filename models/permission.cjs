'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Permission.belongsTo(models.Role, { foreignKey: 'roleId', targetKey: 'id' });
      models.Permission.belongsTo(models.Route, { foreignKey: 'routeId', targetKey: 'id' });
    }
  }
  Permission.init({
    actions: DataTypes.STRING(100),
    state: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Permission',
  });
  return Permission;
};