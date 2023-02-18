const router = require('express').Router();
const validators = require('./messenger.validators');
const controller = require('./messenger.controller');
const shareMid = require('./../../middleware/share.mid');
const { errorController } = require('./../handle-error');
const middleware = require('./messenger.middleware');

router.post(
  '/api/set_message',
  shareMid.checkFields(['token', 'receiver_id', 'message']),
  validators.checkSetMessage(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleSetMessage
);

router.post(
  '/api/get_list_conversation',
  shareMid.checkFields(['token', 'index', 'count']),
  validators.checkGetListConversation(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleGetListConversation
);

router.post(
  '/api/get_conversation',
  shareMid.checkFields(['token', 'partner_id', 'conversation_id', 'index', 'count']),
  validators.checkGetConversation(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleGetConversation
);

router.post(
  '/api/set_read_message',
  shareMid.checkFields(['token', 'partner_id', 'conversation_id']),
  validators.checkSetReadMessage(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  middleware.checkHostAndPartner,
  controller.handleSeReadMessage
);

router.post(
  '/api/delete_message',
  shareMid.checkFields(['token', 'message_id', 'conversation_id', 'partner_id']),
  validators.checkDeleteMessage(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  middleware.checkHostAndPartner,
  controller.handleDeleteMessage
);

router.post(
  '/api/delete_conversation',
  shareMid.checkFields(['token', 'partner_id', 'conversation_id']),
  validators.checkDeleteConversation(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  middleware.checkConversation,
  controller.handleDeleteConversation
);
module.exports = router;
