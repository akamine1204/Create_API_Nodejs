const { body, param } = require('express-validator');

const createCheckChains = (name, where) => {
  switch (where) {
    case 'body': {
      return body(name);
    }
    case 'param': {
      return param(name);
    }
  }
};

const createCheckList = (checkChains, checkList) => {
  checkList.forEach((checkConfig) => {
    const minValue = Number.MIN_VALUE;
    const maxValue = Number.MAX_VALUE;
    const {
      type,
      message,
      pattern,
      min = minValue,
      max = maxValue,
      isNot,
      isInOptions,
    } = checkConfig;
    if (isNot) {
      checkChains.not();
    }
    switch (type) {
      case 'optional': {
        checkChains.optional();
        break;
      }
      case 'not': {
        checkChains.not();
        break;
      }
      case 'trim': {
        checkChains.trim();
        break;
      }
      case 'existed': {
        checkChains.exists();
        checkChains.withMessage(message);
        break;
      }
      case 'notEmpty': {
        checkChains.notEmpty();
        checkChains.withMessage(message);
        break;
      }
      case 'matches': {
        checkChains.matches(pattern);
        checkChains.withMessage(message);
        break;
      }
      case 'isLength': {
        checkChains.isLength({ min, max });
        checkChains.withMessage(message);
        break;
      }
      case 'isJWT': {
        checkChains.isJWT();
        checkChains.withMessage(message);
        break;
      }
      case 'isURL': {
        checkChains.isURL();
        checkChains.withMessage(message);
        break;
      }
      case 'isArray': {
        checkChains.isArray();
        checkChains.withMessage(message);
        break;
      }
      case 'isInt': {
        checkChains.isInt({ min, max });
        checkChains.withMessage(message);
        break;
      }
      case 'isIn': {
        checkChains.isIn(isInOptions);
        checkChains.withMessage(message);
        break;
      }
      case 'toInt': {
        checkChains.toInt();
        break;
      }
      case 'isUUID': {
        checkChains.isUUID();
        checkChains.withMessage(message);
        break;
      }
      case 'isNumeric': {
        checkChains.isNumeric();
        checkChains.withMessage(message);
        break;
      }
      case 'toFloat': {
        checkChains.toFloat();
        break;
      }
    }
  });
  return checkChains;
};

module.exports = {
  createValidators: (configs) => {
    const validators = [];
    configs.forEach((config) => {
      let checkChains = createCheckChains(config.name, config.where);
      checkChains = createCheckList(checkChains, config.checkList);
      validators.push(checkChains);
    });
    return validators;
  },
};
