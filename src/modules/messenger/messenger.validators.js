const { validatorUtils } = require('./../../utils');
const configs = require('./../../constants/validators');

module.exports = {
  checkGetListConversation: () =>
    validatorUtils.createValidators([configs.body.token, configs.body.index, configs.body.count]),
  checkSetMessage: () =>
    validatorUtils.createValidators([
      configs.body.token,
      configs.body.receiverId,
      configs.body.message,
    ]),
  checkGetConversation: () =>
    validatorUtils.createValidators([
      configs.body.token,
      configs.body.partnerId,
      configs.body.conversationId,
      configs.body.index,
      configs.body.count,
    ]),
  checkSetReadMessage: () =>
    validatorUtils.createValidators([
      configs.body.token,
      configs.body.partnerId,
      configs.body.conversationId,
    ]),
  checkDeleteMessage: () =>
    validatorUtils.createValidators([
      configs.body.token,
      configs.body.messageId,
      configs.body.conversationId,
      configs.body.partnerId,
    ]),
  checkDeleteConversation: () =>
    validatorUtils.createValidators([
      configs.body.token,
      configs.body.partnerId,
      configs.body.conversationId,
    ]),
};
