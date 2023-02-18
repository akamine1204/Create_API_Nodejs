'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notifications extends Model {
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
  notifications.init(
    {
      type: DataTypes.STRING,
      objectId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      group: DataTypes.STRING,
      accountId: DataTypes.INTEGER,
      read: DataTypes.BOOLEAN,
      creatorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'notifications',
    },
  );
  return notifications;
};
