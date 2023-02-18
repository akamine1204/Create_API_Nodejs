'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class messages extends Model {
    static associate(models) {}
  }
  messages.init(
    {
      conversationId: DataTypes.INTEGER,
      message: DataTypes.TEXT,
      read: DataTypes.STRING,
      sender: DataTypes.INTEGER,
      isDeleted: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'messages',
    }
  );
  return messages;
};
