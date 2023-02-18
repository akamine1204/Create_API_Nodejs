const { validatorUtils } = require('./../../utils');
const validationConfigs = require('./../../constants/validators');

module.exports = {
  validateImgId: () => validatorUtils.createValidators([validationConfigs.param.imgId]),
  checkNewPostPayload: () =>
    validatorUtils.createValidators([
      validationConfigs.body.described,
      validationConfigs.body.status,
    ]),
  checkVideoId: () => validatorUtils.createValidators([validationConfigs.param.videoId]),
  checkGetPost: () =>
    validatorUtils.createValidators([validationConfigs.body.token, validationConfigs.body.postId]),
  checkEditPost: () =>
    validatorUtils.createValidators([
      validationConfigs.body.token,
      validationConfigs.body.postId,
      validationConfigs.body.status,
      validationConfigs.body.described,
      validationConfigs.body.autoAccept,
      validationConfigs.body.autoBlock,
      validationConfigs.body.imageDel,
      validationConfigs.body.imageSort,
    ]),
  checkReportPost: () =>
    validatorUtils.createValidators([
      validationConfigs.body.token,
      validationConfigs.body.postId,
      validationConfigs.body.subject,
      validationConfigs.body.details,
    ]),
  checkLike: () =>
    validatorUtils.createValidators([validationConfigs.body.token, validationConfigs.body.postId]),
  checkGetComment: () =>
    validatorUtils.createValidators([
      validationConfigs.body.token,
      validationConfigs.body.postId,
      validationConfigs.body.index,
      validationConfigs.body.count,
    ]),
  checkSetComment: () =>
    validatorUtils.createValidators([
      validationConfigs.body.token,
      validationConfigs.body.postId,
      validationConfigs.body.comment,
      validationConfigs.body.index,
      validationConfigs.body.count,
    ]),
  checkGetListPosts: () =>
    validatorUtils.createValidators([
      validationConfigs.body.token,
      validationConfigs.body.userId,
      validationConfigs.body.inCampaign,
      validationConfigs.body.campaignId,
      validationConfigs.body.latitude,
      validationConfigs.body.longitude,
      validationConfigs.body.lastId,
      validationConfigs.body.index,
      validationConfigs.body.count,
    ]),
  checkIsNewItem: () =>
    validatorUtils.createValidators([
      validationConfigs.body.lastIdRequired,
      validationConfigs.body.categoryId,
    ]),
  checkGetSavedSearch: () =>
    validatorUtils.createValidators([
      validationConfigs.body.token,
      validationConfigs.body.index,
      validationConfigs.body.count,
    ]),
  checkDelSavedSearch: () =>
    validatorUtils.createValidators([
      validationConfigs.body.token,
      validationConfigs.body.searchId,
      validationConfigs.body.all,
    ]),
  checkSearch: () =>
    validatorUtils.createValidators([
      validationConfigs.body.token,
      validationConfigs.body.keyword,
      validationConfigs.body.userId,
      validationConfigs.body.index,
      validationConfigs.body.count,
    ]),
};
