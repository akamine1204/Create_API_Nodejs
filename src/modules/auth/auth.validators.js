const { validatorUtils } = require('./../../utils');
const configs = require('./../../constants/validators');

module.exports = {
  validateSignUpPayload: () =>
    validatorUtils.createValidators([
      configs.body.phone,
      configs.body.password,
      configs.body.email,
      configs.body.uuid,
    ]),
  validatePhoneNumber: () => validatorUtils.createValidators([configs.body.phone]),
  validateCheckVerifyCode: () =>
    validatorUtils.createValidators([configs.body.phone, configs.body.verifyCode]),
  validateToken: () => validatorUtils.createValidators([configs.body.token]),
  validateLoginPayload: () =>
    validatorUtils.createValidators([configs.body.phone, configs.body.password, configs.body.uuid]),
};
