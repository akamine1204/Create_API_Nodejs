'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.accounts, { foreignKey: 'creatorId' });
      this.hasMany(models.comments, { foreignKey: 'postId' });
      this.hasMany(models.likes, { foreignKey: 'postId' });
      this.hasMany(models.reports, { foreignKey: 'postId' });
      this.hasMany(models.postImages, { foreignKey: 'postId' });
      this.hasMany(models.postVideos, { foreignKey: 'postId' });
    }
  }
  posts.init(
    {
      creatorId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      media: DataTypes.STRING,
      status: DataTypes.STRING,
      isCanComment: DataTypes.BOOLEAN,
      isCanEdit: DataTypes.BOOLEAN,
      isBanned: DataTypes.BOOLEAN,
      isLocked: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'posts',
    },
  );
  return posts;
};
