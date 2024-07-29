'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class channels extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      channels.belongsTo(models.User , { foreignKey:'owner_id' });
      channels.belongsTo(models.User , { foreignKey:'contractor_id' });
      channels.belongsTo(models.Property , { foreignKey:'property_id' });
      channels.hasMany(models.chats , { foreignKey:'channel_id' });
    }
  }
  channels.init({
    property_id: DataTypes.INTEGER,
    owner_id: DataTypes.INTEGER,
    contractor_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'channels',
  });
  return channels;
};