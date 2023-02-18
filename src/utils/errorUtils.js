module.exports = {
  createError: (statusCode, resCode, message, isRenewToken = false) => {
    const error = new Error(message);
    error.resCode = resCode;
    error.statusCode = statusCode || 500;
    error.isRenewToken = isRenewToken;
    return error;
  },
};
