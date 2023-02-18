'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    static associate(models) {
      this.hasMany(models.comments, { foreignKey: 'writerId' });
      this.hasMany(models.likes, { foreignKey: 'accountId' });
      this.hasMany(models.reports, { foreignKey: 'reporterId' });
      this.hasMany(models.posts, { foreignKey: 'creatorId' });
      this.hasMany(models.blockers, { foreignKey: 'userId' });
      this.hasMany(models.savedKeywords, { foreignKey: 'accountId' });
      this.hasMany(models.requestAddFriends, { foreignKey: 'senderId' });
      this.hasMany(models.friends, { foreignKey: 'accountId' });
      this.hasOne(models.settings, { foreignKey: 'accountId' });
      this.hasOne(models.notifications, { foreignKey: 'accountId' });
    }
  }
  account.init(
    {
      bgSrc: DataTypes.BLOB,
      name: DataTypes.STRING,
      uuid: DataTypes.STRING,
      token: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      bgLink: DataTypes.STRING,
      avatarSrc: DataTypes.BLOB,
      password: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      isBlocked: DataTypes.BOOLEAN,
      avatarLink: DataTypes.STRING,
      verifyCode: DataTypes.STRING,
      codeExpireIn: DataTypes.STRING,
      countViolation: DataTypes.STRING,
      deviceId: DataTypes.STRING,
      bgType: DataTypes.STRING,
      avatarType: DataTypes.STRING,
      maxFriendCount: DataTypes.INTEGER,
      desc: DataTypes.TEXT,
      link: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      devType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'accounts',
    },
  );
  return account;
};
