'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class settings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.accounts, { foreignKey: 'accountId' });
    }
  }
  settings.init(
    {
      accountId: DataTypes.INTEGER,
      likeComment: DataTypes.STRING,
      fromFriends: DataTypes.STRING,
      requestedFriend: DataTypes.STRING,
      suggestedFriend: DataTypes.STRING,
      birthday: DataTypes.STRING,
      video: DataTypes.STRING,
      report: DataTypes.STRING,
      soundOn: DataTypes.STRING,
      notificationOn: DataTypes.STRING,
      vibrantOn: DataTypes.STRING,
      ledOn: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'settings',
    },
  );
  return settings;
};
