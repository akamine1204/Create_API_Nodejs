const router = require('express').Router();
const controller = require('./auth.controller');
const { errorController } = require('./../handle-error');
const validators = require('./auth.validators');
const shareMid = require('./../../middleware/share.mid');

const LOGOUT_FIELDS = ['token'];
const GET_VERIFY_CODE_FIELDS = ['phonenumber'];
const SIGN_IN_VALID_FIELDS = ['phonenumber', 'password', 'uuid'];
const CHECK_VERIFY_CODE_FIELDS = ['phonenumber', 'code_verify'];
const SIGN_UP_VALID_FIELDS = ['phonenumber', 'password', 'uuid', 'email'];

// Api
router.post(
  '/api/check_verify_code',
  shareMid.checkFields(CHECK_VERIFY_CODE_FIELDS),
  validators.validateCheckVerifyCode(),
  errorController.catchValidationError,
  controller.handleCheckVerifyCode,
);

router.post(
  '/api/get_verify_code',
  shareMid.checkFields(GET_VERIFY_CODE_FIELDS),
  validators.validatePhoneNumber(),
  errorController.catchValidationError,
  controller.handleGetVerifyCode,
);

router.post(
  '/api/logout',
  shareMid.checkFields(LOGOUT_FIELDS),
  validators.validateToken(),
  errorController.catchValidationError,
  controller.handleLogout,
);

router.post(
  '/api/login',
  shareMid.checkFields(SIGN_IN_VALID_FIELDS),
  validators.validateLoginPayload(),
  errorController.catchValidationError,
  controller.handleLogin,
);

router.post(
  '/api/signup',
  shareMid.checkFields(SIGN_UP_VALID_FIELDS),
  validators.validateSignUpPayload(),
  errorController.catchValidationError,
  controller.handleSignUp,
);

module.exports = router;
