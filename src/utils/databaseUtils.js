const models = require('./../models');

module.exports = {
  connectToDb: () => {
    return models.sequelize.authenticate();
  },
};
