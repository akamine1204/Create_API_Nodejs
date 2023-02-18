const router = require('express').Router();
const controller = require('./user.controller');
const validators = require('./user.validators');
const { multerUtil } = require('./../../utils');
const { errorController } = require('../handle-error');
const shareMid = require('./../../middleware/share.mid');
const middleware = require('./user.middleware');

const CHANGE_INFO_VALID_FIELDS = ['token', 'username', 'avatar'];
const SET_SETTINGS_VALID_FIELDS = [
  'token',
  'like_comment',
  'from_friends',
  'requested_friend',
  'suggested_friend',
  'birthday',
  'video',
  'report',
  'sound_on',
  'notification_on',
  'vibrant_on',
  'led_on',
];

router.get(
  '/api/get_avatar/:user_id',
  validators.validateUserId(),
  errorController.catchValidationError,
  controller.getAvatar,
);

router.get(
  '/api/get_bg/:user_id',
  validators.validateUserId(),
  errorController.catchValidationError,
  controller.getBackground,
);

router.post(
  '/api/change_info_after_signup',
  multerUtil.single('avatar'),
  shareMid.checkFields(CHANGE_INFO_VALID_FIELDS),
  validators.validateChangeInfo(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleChangeInfoAfterSignUp,
);

router.post(
  '/api/set_request_friend',
  shareMid.checkFields(['token', 'user_id']),
  validators.validateSetRequestFriend(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleSetRequestFriend,
);

router.post(
  '/api/get_requested_friends',
  shareMid.checkFields(['token', 'index', 'count']),
  validators.checkGetListRequestedFriends(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleGetRequestedFriends,
);

router.post(
  '/api/set_accept_friend',
  shareMid.checkFields(['token', 'user_id', 'is_accept']),
  validators.validateSetAcceptFriend(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleSetAcceptFriend,
);

router.post(
  '/api/get_list_suggested_friends',
  shareMid.checkFields(['token', 'index', 'count']),
  validators.checkGetListRequestedFriends(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleGetListSuggestFriends,
);

router.post(
  '/api/get_list_blocks',
  shareMid.checkFields(['token', 'index', 'count']),
  validators.checkGetListBlocks(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleGetListBlocks,
);

router.post(
  '/api/change_password',
  shareMid.checkFields(['token', 'password', 'new_password']),
  validators.validateChangePassword(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleChangePassword,
);

router.post(
  '/api/get_push_settings',
  shareMid.checkFields(['token']),
  validators.validateToken(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleGetPushSettings,
);

router.post(
  '/api/set_push_settings',
  shareMid.checkFields(SET_SETTINGS_VALID_FIELDS),
  validators.validateChangeSetting(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleSetPushSettings,
);

router.post(
  '/api/set_block',
  shareMid.checkFields(['token', 'user_id', 'type']),
  validators.validateSetBlock(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleSetBlock,
);

router.post(
  '/api/get_user_friends',
  shareMid.checkFields(['user_id', 'token', 'index', 'count']),
  validators.checkGetUserFriends(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleGetUserFriends,
);

router.post(
  '/api/get_user_info',
  shareMid.checkFields(['token', 'user_id']),
  validators.checkGetUserInfo(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleGetUserInfo,
);

router.post(
  '/api/set_user_info',
  multerUtil.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'cover_image',
      maxCount: 1,
    },
  ]),
  middleware.checkUserImages,
  shareMid.checkFields([
    'token',
    'username',
    'description',
    'address',
    'city',
    'country',
    'link',
    'avatar',
    'cover_image',
  ]),
  validators.checkSetUserInfo(),
  errorController.catchValidationError,
  middleware.checkLink,
  shareMid.verifyToken,
  controller.handleSetUserInfo,
);

router.post(
  '/api/set_devtoken',
  shareMid.checkFields(['token', 'devtype', 'devtoken']),
  validators.checkSetDevToken(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleSetDevToken,
);

module.exports = router;
