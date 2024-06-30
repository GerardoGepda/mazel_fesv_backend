'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Activity.hasMany(models.Customer, { foreignKey: 'activityId', sourceKey: 'id' });
    }
  }
  Activity.init({
    name: DataTypes.TEXT,
    codeMH: DataTypes.STRING(10),
    state: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Activity',
  });
  return Activity;
};