'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class proofofwork_images extends Model {
  
    static associate(models) {
      // define association here
      proofofwork_images.belongsTo(models.proofofwork , { foreignKey:'proofofwork_id' })
    }
  }
  proofofwork_images.init({
    proofofwork_id: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, 
  {
    sequelize,
    modelName: 'proofofwork_images',
  });
  return proofofwork_images;
};