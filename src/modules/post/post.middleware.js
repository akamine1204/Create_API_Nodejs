const models = require('./../../models');
const { catchAsync } = require('./../../utils');
const { errorUtils } = require('./../../utils');

module.exports = {
  checkPostAndAccount: catchAsync(async (req, res, next) => {
    const { accountId } = req.data;
    const { id } = req.body;
    const [post, account] = await Promise.all([
      models.posts.findByPk(+id),
      models.accounts.findByPk(accountId, {
        attributes: {
          exclude: ['avatarSrc', 'bgSrc'],
        },
      }),
    ]);
    if (!post) {
      throw errorUtils.createError(404, 9992, 'Not found post');
    }
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found account');
    }
    if (post.isLocked) {
      throw errorUtils.createError(
        403,
        1009,
        'The post is currently not available now because it have already been locked due to violate public standard. Please try it later',
      );
    }
    if (!account.isActive) {
      throw errorUtils.createError(
        400,
        9995,
        'Your account was blocked due to violate public standard',
      );
    }
    if (account.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'Can execute this request because your account was locked due to violate public standard',
      );
    }
    req.account = account;
    req.post = post;
    return next();
  }),

  checkImagesAndVideoSize: (req, res, next) => {
    const {
      VALID_IMG_FILES,
      VALID_VIDEO_FILES,
      MAX_IMG_FILE_SIZE,
      MAX_VIDEO_FILE_SIZE,
      MAX_IMAGE_COUNT,
      MAX_VIDEO_COUNT,
    } = process.env;
    const { image: images, video: videos } = req.files;
    if (images) {
      if (images.length > +MAX_IMAGE_COUNT) {
        return next(errorUtils.createError(400, 1004, 'Only allow uploading up to 4 files'));
      }
      for (const img of images) {
        const { size, mimetype } = img;
        if (VALID_IMG_FILES.indexOf(mimetype) === -1) {
          return next(errorUtils.createError(400, 1004, 'Unsupported this image file'));
        }
        if (size > +MAX_IMG_FILE_SIZE) {
          return next(
            errorUtils.createError(
              400,
              1004,
              'The image file is too large (>10MB). Please choose an another file',
            ),
          );
        }
      }
      req.images = images;
    }
    if (videos) {
      if (videos.length > +MAX_VIDEO_COUNT) {
        return next(errorUtils.createError(400, 1004, 'Only allow uploading up to 4 videos'));
      }
      for (const video of videos) {
        const { size, mimetype } = video;
        if (VALID_VIDEO_FILES.indexOf(mimetype) === -1) {
          return next(errorUtils.createError(400, 1004, 'Unsupported this image file'));
        }
        if (size > +MAX_VIDEO_FILE_SIZE) {
          return next(
            errorUtils.createError(
              400,
              1004,
              'The video is too large (>30MB). Please choose an another file',
            ),
          );
        }
      }
      req.videos = videos;
    }
    return next();
  },

  checkEmptyPayload: (req, res, next) => {
    const { image, video } = req.files;
    const { described, status } = req.body;
    // Is empty image
    const isEmptyImage = !image || !image.length;
    const isEmptyVideo = !video || !video.length;
    const isEmptyDescribed = !described || !described.trim();
    const isEmptyStatus = !status || !status.trim();
    // Is Empty post
    const isEmptyPost = isEmptyImage && isEmptyVideo && isEmptyDescribed && isEmptyStatus;
    if (isEmptyPost) {
      return next(errorUtils.createError(400, 1004, 'Can not create post without content'));
    }
    return next();
  },

  checkEditPayload: (req, res, next) => {},

  checkDecodedDataAndUserParams: (req, res, next) => {
    const { accountId } = req.data;
    const { user_id } = req.body;
    if (accountId !== +user_id) {
      return next(
        errorUtils.createError(
          403,
          1004,
          'You are using the token of another user. Please do not do it again',
          true,
        ),
      );
    }
    return next();
  },
};
