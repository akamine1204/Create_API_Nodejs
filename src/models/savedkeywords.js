'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class savedKeywords extends Model {
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
  savedKeywords.init(
    {
      accountId: DataTypes.INTEGER,
      keyword: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'savedKeywords',
    },
  );
  return savedKeywords;
};
