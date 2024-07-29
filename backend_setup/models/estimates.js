'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Estimates extends Model {
  
    static associate(models) {
      Estimates.belongsTo(models.Property , { foreignKey:'property_id' });
      Estimates.belongsTo(models.User , { foreignKey:'contractor_id' });
      // Estimates.belongsTo(models.User , { foreignKey:'contractor_name' });

    }
  }
  Estimates.init({
    contractor_id: DataTypes.INTEGER,
    property_id: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    time: DataTypes.STRING,
    status:DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Estimates',
    paranoid:true,
  });
  return Estimates;
};