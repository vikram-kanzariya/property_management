'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  payment.init({
    owner_id: DataTypes.INTEGER,
    contractor_id: DataTypes.INTEGER,
    property_id: DataTypes.INTEGER,
    amount: DataTypes.STRING,
    session_id: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'payment',
  });
  return payment;
};