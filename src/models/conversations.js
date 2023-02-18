'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class conversations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  conversations.init(
    {
      hostId: DataTypes.INTEGER,
      partnerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'conversations',
      timestamps: false,
    },
  );
  return conversations;
};
