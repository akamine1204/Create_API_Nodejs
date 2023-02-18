'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.accounts, { foreignKey: 'reporterId' });
      this.belongsTo(models.posts, { foreignKey: 'postId' });
    }
  }
  reports.init(
    {
      postId: DataTypes.INTEGER,
      reporterId: DataTypes.INTEGER,
      subject: DataTypes.STRING,
      details: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'reports',
    },
  );
  return reports;
};
