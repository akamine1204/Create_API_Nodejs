const multer = require('multer');
const memoryStorage = multer.memoryStorage();

const multerUtil = multer({
  storage: memoryStorage,
});

module.exports = multerUtil;
