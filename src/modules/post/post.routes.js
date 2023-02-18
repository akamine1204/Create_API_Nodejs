const { errorController } = require('../handle-error');
const controller = require('./post.controller');
const middleware = require('./post.middleware');
const validators = require('./post.validators');
const router = require('express').Router();
const { multerUtil } = require('./../../utils');
const shareMid = require('./../../middleware/share.mid');
const postMid = require('./post.middleware');

const GET_LIST_POSTS_VALID_PARAMS = [
  'token',
  'user_id',
  'in_campaign',
  'campaign_id',
  'latitude',
  'longitude',
  'last_id',
  'index',
  'count',
];

router.post(
  '/api/check_new_item',
  validators.checkIsNewItem(),
  errorController.catchValidationError,
  controller.handleCheckNewItem
);

router.post(
  '/api/edit_post',
  multerUtil.fields([
    {
      name: 'image',
      maxCount: Number.MAX_SAFE_INTEGER,
    },
    {
      name: 'thumb',
      maxCount: Number.MAX_SAFE_INTEGER,
    },
  ]),
  shareMid.checkFields([
    'token',
    'id',
    'described',
    'status',
    'image',
    'image_del',
    'image_sort',
    'video',
    'thumb',
    'auto_accept',
    'auto_block',
  ]),
  errorController.catchValidationError,
  shareMid.verifyToken,
  middleware.checkPostAndAccount,
  controller.handleEditPost
);

// Api
router.get(
  '/api/get_post_img/:imgId',
  validators.validateImgId(),
  errorController.catchValidationError,
  controller.handleGetPostImg
);

router.get(
  '/api/get_post_video/:videoId',
  validators.checkVideoId(),
  errorController.catchValidationError,
  controller.handleGetPostVideo
);

router.post(
  '/api/add_post',
  multerUtil.fields([
    {
      name: 'image',
      maxCount: Number.MAX_SAFE_INTEGER,
    },
    {
      name: 'video',
      maxCount: Number.MAX_SAFE_INTEGER,
    },
  ]),
  shareMid.checkFields(['token', 'described', 'status']),
  validators.checkNewPostPayload(),
  errorController.catchValidationError,
  postMid.checkEmptyPayload,
  postMid.checkImagesAndVideoSize,
  shareMid.verifyToken,
  controller.handleAddPost
);

router.post(
  '/api/get_list_posts',
  shareMid.checkFields(GET_LIST_POSTS_VALID_PARAMS),
  validators.checkGetListPosts(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleGetListPosts
);

router.post(
  '/api/get_post',
  shareMid.checkFields(['token', 'id']),
  validators.checkGetPost(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleGetPost
);

router.post(
  '/api/delete_post',
  shareMid.checkFields(['token', 'id']),
  shareMid.verifyToken,
  middleware.checkPostAndAccount,
  controller.handleDeletePost
);

router.post(
  '/api/report_post',
  shareMid.checkFields(['token', 'id', 'subject', 'details']),
  validators.checkReportPost(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  middleware.checkPostAndAccount,
  controller.handleReportPost
);

router.post(
  '/api/like',
  shareMid.checkFields(['token', 'id']),
  validators.checkLike(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  middleware.checkPostAndAccount,
  controller.handleLikePost
);

router.post(
  '/api/get_comment',
  shareMid.checkFields(['token', 'id', 'index', 'count']),
  validators.checkGetComment(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  middleware.checkPostAndAccount,
  controller.handleGetComment
);

router.post(
  '/api/set_comment',
  shareMid.checkFields(['token', 'id', 'index', 'count', 'comment']),
  validators.checkSetComment(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  middleware.checkPostAndAccount,
  controller.handleSetComment
);

router.post(
  '/api/search',
  shareMid.checkFields(['token', 'keyword', 'user_id', 'index', 'count']),
  validators.checkSearch(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleSearch
);

router.post(
  '/api/get_saved_keyword',
  shareMid.checkFields(['token', 'index', 'count']),
  validators.checkGetSavedSearch(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleGetSavedKeyword
);

router.post(
  '/api/del_saved_search',
  shareMid.checkFields(['token', 'search_id', 'all']),
  validators.checkDelSavedSearch(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleDeleteSavedSearch
);

router.post(
  '/api/get_list_videos',
  shareMid.checkFields([
    'token',
    'user_id',
    'in_campaign',
    'campaign_id',
    'latitude',
    'longitude',
    'last_id',
    'index',
    'count',
  ]),
  validators.checkGetListPosts(),
  errorController.catchValidationError,
  shareMid.verifyToken,
  controller.handleGetListVideos
);

module.exports = router;
