'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.accounts, { foreignKey: 'accountId' });
      this.belongsTo(models.posts, { foreignKey: 'postId' });
    }
  }
  likes.init(
    {
      postId: DataTypes.INTEGER,
      accountId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'likes',
    },
  );
  return likes;
};
