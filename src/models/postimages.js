'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class postImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.posts, { foreignKey: 'postId' });
    }
  }
  postImages.init(
    {
      postId: DataTypes.INTEGER,
      image: DataTypes.BLOB,
      type: DataTypes.STRING,
      order: DataTypes.INTEGER,
      imageUrl: DataTypes.STRING,
      size: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'postImages',
    },
  );
  return postImages;
};
