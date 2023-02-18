const { validatorUtils } = require('./../../utils');
const configs = require('./../../constants/validators');

module.exports = {
  checkGetNotification: () =>
    validatorUtils.createValidators([configs.body.token, configs.body.index, configs.body.count]),
  checkSetReadNotification: () =>
    validatorUtils.createValidators([configs.body.token, configs.body.notification_id]),
};
