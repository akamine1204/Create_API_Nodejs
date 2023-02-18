const { errorUtils } = require('./../../utils');

module.exports = {
  checkUserImages: (req, res, next) => {
    const { VALID_IMG_FILES, MAX_IMG_FILE_SIZE } = process.env;
    for (const field of Object.keys(req.files)) {
      const [img] = req.files[field];
      const { size, mimetype } = img;
      if (VALID_IMG_FILES.indexOf(mimetype) === -1) {
        return next(errorUtils.createError(400, 1004, 'Unsupported this image file'));
      } else if (size > +MAX_IMG_FILE_SIZE) {
        return next(
          errorUtils.createError(
            400,
            1004,
            `The ${field} file is too large (>10MB). Please choose an another file`,
          ),
        );
      } else {
        req.body[field] = img;
      }
    }
    return next();
  },
  checkLink: (req, res, next) => {
    const { link } = req.body;
    if (link) {
      const invalidLinks = process.env.INVALID_LINKS.split(',');
      for (const item of invalidLinks) {
        if (link.trim().indexOf(item.trim()) !== -1) {
          throw errorUtils.createError(400, 1004, 'The link was banned for security reason');
        }
      }
    }
    return next();
  },
};
