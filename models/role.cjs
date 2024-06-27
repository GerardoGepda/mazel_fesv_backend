'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Role.hasMany(models.User, { foreignKey: 'roleId', sourceKey: 'id' });
      models.Role.hasMany(models.Permission, { foreignKey: 'roleId', sourceKey: 'id' });
    }
  }
  Role.init({
    name: DataTypes.STRING(25),
    state: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};