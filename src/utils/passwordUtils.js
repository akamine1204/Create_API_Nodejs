const bcryptjs = require('bcryptjs');

module.exports = {
  hashPassword: async (password) => {
    const hash = await bcryptjs.hash(password, 10);
    return hash;
  },
  isPasswordMatch: async (hash, password) => {
    const isMatch = await bcryptjs.compare(password, hash);
    return isMatch;
  },
};
