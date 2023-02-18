'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class requestAddFriends extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.accounts, { foreignKey: 'senderId' });
    }
  }
  requestAddFriends.init(
    {
      senderId: DataTypes.INTEGER,
      receiverId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'requestAddFriends',
    },
  );
  return requestAddFriends;
};
