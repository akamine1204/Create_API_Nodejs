const router = require('express').Router();
const validators = require('./notification.validators');
const shareMid = require('./../../middleware/share.mid');
const { errorController } = require('./../handle-error');
const controller = require('./notification.controller');

router.post(
  '/api/get_notification',
  shareMid.checkFields(['token', 'index', 'count']),
  validators.checkGetNotification(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleGetNotification,
);

router.post(
  '/api/set_read_notification',
  shareMid.checkFields(['token', 'notification_id']),
  validators.checkSetReadNotification(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleSetReadNotification,
);
module.exports = router;
