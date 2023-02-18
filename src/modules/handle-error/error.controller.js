require('dotenv').config();
const { validationResult } = require('express-validator');
const errorConstant = require('../../constants/error');
const responses = require('../../constants/response');
const errorUtils = require('./../../utils/errorUtils');

module.exports = {
  handleError: (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const resCode = err.resCode;
    const message = err.message;
    const tracing =
      process.env.NODE_ENV !== 'production' && statusCode === 500 ? { tracing: err.stack } : null;
    const isRenewToken = err.isRenewToken ? { isRenewToken: true } : null;
    return res.status(statusCode).json({
      message,
      code: isRenewToken ? 9998 : resCode,
      ...isRenewToken,
      ...tracing,
    });
  },
  catchValidationError: (req, _, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const [firstError] = errors.array();
      const isRenewToken = firstError.msg === errorConstant.ERROR_AUTH_TOKEN_NOT_EXISTED;
      const detailError = errorUtils.createError(
        400,
        responses.RES_1004.code,
        firstError.msg,
        isRenewToken,
      );
      return next(detailError);
    }
    return next();
  },
};
