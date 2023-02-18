'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blocker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.accounts, { foreignKey: 'userId' });
    }
  }
  blocker.init(
    {
      userId: DataTypes.INTEGER,
      blockerId: DataTypes.INTEGER,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'blockers',
    },
  );
  return blocker;
};
