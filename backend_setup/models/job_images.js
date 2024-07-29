'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Job_images extends Model {

    static associate(models) {
      // define association here
      Job_images.belongsTo(models.Jobs , { foreignKey:'job_id' });
    }
  }
  Job_images.init({
    job_id: DataTypes.INTEGER,
    images: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Job_images',
  });
  return Job_images;
};