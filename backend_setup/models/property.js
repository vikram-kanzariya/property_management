'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Property.hasMany(models.Jobs , { foreignKey:'propertyId' });
      Property.hasMany(models.Estimates , { foreignKey:'property_id' });
      Property.belongsTo(models.User , { foreignKey:'owner_id' });
      Property.hasOne(models.proofofwork , { foreignKey:'property_id' });
      Property.hasMany(models.channels , { foreignKey:'property_id' });
    }
  }
  Property.init({
    owner_id:DataTypes.INTEGER,
    owner_name: DataTypes.STRING,
    property_name: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Property',
    paranoid:true,
  });
  return Property;
};