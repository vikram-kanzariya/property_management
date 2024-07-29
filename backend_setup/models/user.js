'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lif
     * ecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Roles , { foreignKey:"roleId" });
      User.hasMany(models.Property , { foreignKey:'owner_id'});
      User.hasMany(models.proofofwork , { foreignKey:'contractor_id' });
      User.hasMany(models.chats , { foreignKey:'senderId' });
      User.hasMany(models.Estimates , { foreignKey:'contractor_id' });
      User.hasMany(models.channels , { foreignKey:'owner_id' });
      User.hasMany(models.channels , { foreignKey:'contractor_id' });
      // User.hasMany(models.Estimates , { foreignKey:'contractor_name' });
    }
  }
  User.init({
    roleId: DataTypes.INTEGER,
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    paranoid:true,
  });
  return User;
};