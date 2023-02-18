'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.accounts, { foreignKey: 'writerId' });
      this.belongsTo(models.posts, { foreignKey: 'postId' });
    }
  }
  comments.init(
    {
      writerId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      postId: DataTypes.INTEGER,
      commentIdx: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'comments',
    },
  );
  return comments;
};
