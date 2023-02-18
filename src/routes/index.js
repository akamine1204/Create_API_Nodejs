const { authRoutes } = require('../modules/auth');
const { errorController } = require('../modules/handle-error');
const { messengerRoutes } = require('../modules/messenger');
const { notificationRoutes } = require('../modules/notification');
const { postRoutes } = require('../modules/post');
const { userRoutes } = require('../modules/user');

const initRoutes = (app) => {
  app.use(authRoutes);
  app.use(postRoutes);
  app.use(userRoutes);
  app.use(messengerRoutes);
  app.use(notificationRoutes);
  app.use('*', (req, res, next) => {
    const error = new Error('Not found url');
    error.statusCode = 404;
    return next(error);
  });
  app.use(errorController.handleError);
};

module.exports = initRoutes;
