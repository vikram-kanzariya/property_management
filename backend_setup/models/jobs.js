'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jobs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Jobs.belongsTo(models.Property , { foreignKey:'propertyId' });
      Jobs.hasMany(models.Job_images , { foreignKey:'job_id' })
    }
  }
  Jobs.init({
    propertyId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    job_status:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Jobs',
    paranoid:true,
  });
  return Jobs;
};