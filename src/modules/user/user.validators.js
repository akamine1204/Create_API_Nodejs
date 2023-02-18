const { validatorUtils } = require('../../utils');
const { errorController } = require('../handle-error');
const configs = require('./../../constants/validators');

module.exports = {
  validateChangeInfo: () =>
    validatorUtils.createValidators([configs.body.token, configs.body.username]),
  validateSetRequestFriend: () =>
    validatorUtils.createValidators([configs.body.token, configs.body.userId]),
  validateSetAcceptFriend: () =>
    validatorUtils.createValidators([
      configs.body.token,
      configs.body.userId,
      configs.body.isAccept,
    ]),
  validateToken: () => validatorUtils.createValidators([configs.body.token]),
  validateChangePassword: () =>
    validatorUtils.createValidators([
      configs.body.token,
      configs.body.password,
      configs.body.newPassword,
    ]),
  validateChangeSetting: () =>
    validatorUtils.createValidators([
      configs.body.token,
      configs.body.likeComment,
      configs.body.fromFriends,
      configs.body.suggestedFriend,
      configs.body.birthday,
      configs.body.video,
      configs.body.report,
      configs.body.soundOn,
      configs.body.notificationOn,
      configs.body.vibrantOn,
      configs.body.ledOn,
    ]),
  validateSetBlock: () =>
    validatorUtils.createValidators([
      configs.body.token,
      configs.body.userId,
      configs.body.blockType,
    ]),
  validateUserId: () => validatorUtils.createValidators([configs.param.userId]),
  checkGetListRequestedFriends: () =>
    validatorUtils.createValidators([configs.body.token, configs.body.index, configs.body.count]),
  checkGetUserFriends: () =>
    validatorUtils.createValidators([
      configs.body.userIdOptional,
      configs.body.token,
      configs.body.index,
      configs.body.count,
    ]),
  checkGetListSuggestedFriends: () =>
    validatorUtils.createValidators([configs.body.token, configs.body.index, configs.body.count]),
  checkGetListBlocks: () =>
    validatorUtils.createValidators([configs.body.token, configs.body.index, configs.body.count]),
  checkGetUserInfo: () =>
    validatorUtils.createValidators([configs.body.token, configs.body.userIdOptional]),
  checkSetUserInfo: () =>
    validatorUtils.createValidators([
      configs.body.token,
      configs.body.usernameOptional,
      configs.body.description,
      configs.body.address,
      configs.body.city,
      configs.body.country,
      configs.body.link,
    ]),
  checkSetDevToken: () =>
    validatorUtils.createValidators([
      configs.body.token,
      configs.body.devType,
      configs.body.devToken,
    ]),
};
