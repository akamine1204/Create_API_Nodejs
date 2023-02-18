const _ = require('lodash');
const { errorUtils, jwtUtils, helperUtils } = require('../utils');

module.exports = {
  verifyToken: (req, res, next) => {
    const { token } = req.body;
    try {
      if (!token) {
        return next(errorUtils.createError(401, 1002, 'No token provided'));
      }
      const decodedValue = jwtUtils.verifyToken(token);
      req.data = decodedValue;
      return next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return next(
          errorUtils.createError(403, 1004, 'Invalid token. Please login and try again', true),
        );
      }
      if (error.name === 'TokenExpiredError') {
        return next(
          errorUtils.createError(403, 1004, 'Token has expired. Please login and try again', true),
        );
      }
    }
  },
  checkFields: (validFields) => {
    return (req, res, next) => {
      const fields = _.map(Object.keys(req.body), (f) => f.trim());
      const mergeField = [...new Set([...validFields, ...fields])];
      if (mergeField.length !== validFields.length) {
        const invalidFields = helperUtils.getInvalidFields(req.body, validFields);
        const errorMessage = `'Invalid fields: ${invalidFields.toString()}`;
        const invalidFieldsError = errorUtils.createError(400, 1002, errorMessage);
        return next(invalidFieldsError);
      }
      return next();
    };
  },
};
