'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class postVideos extends Model {
    static associate(models) {
      this.belongsTo(models.posts, { foreignKey: 'postId' });
    }
  }
  postVideos.init(
    {
      postId: DataTypes.INTEGER,
      video: DataTypes.BLOB,
      type: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      size: DataTypes.FLOAT,
      order: DataTypes.INTEGER,
      videoLink: DataTypes.STRING,
      thumbnailSrc: DataTypes.BLOB,
      thumbnailType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'postVideos',
    },
  );
  return postVideos;
};
