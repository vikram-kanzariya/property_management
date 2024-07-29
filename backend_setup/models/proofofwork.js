'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class proofofwork extends Model {
   
    static associate(models) {
      // define association here

      proofofwork.hasMany(models.proofofwork_images , { foreignKey:'proofofwork_id' });
      proofofwork.belongsTo(models.User , { foreignKey:"property_id" });
      proofofwork.belongsTo(models.User , { foreignKey:"contractor_id" });
    }
  }
  proofofwork.init({
    property_id: DataTypes.INTEGER,
    contractor_id:DataTypes.INTEGER,
    work_title: DataTypes.STRING,
    work_description: DataTypes.TEXT,
    comment: DataTypes.STRING,
    status:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'proofofwork',
  });
  return proofofwork;
};