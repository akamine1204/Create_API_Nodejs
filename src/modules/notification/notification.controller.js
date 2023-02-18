const _ = require('lodash');
const models = require('./../../models');
const utils = require('./notifications.utils');
const { catchAsync, errorUtils } = require('./../../utils');

module.exports = {
  handleGetNotification: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { index, count } = req.body;
    const account = await models.accounts.findByPk(accountId, {
      attributes: {
        exclude: ['avatarSrc', 'bgSrc'],
      },
    });
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found user');
    }
    if (account.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'The account was blocked due to violate public standard',
      );
    }
    const getNotificationQuery = utils.createGetNotificationQuery(accountId, index, count);
    const [notifications] = await models.sequelize.query(getNotificationQuery);
    const data = utils.constructGetNotification(notifications);
    const unreadCount = _.filter(data, (item) => !item.read);
    const [lastItem] = data;
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Handling get notification successfully',
      data: utils.constructGetNotification(notifications),
      last_upload: lastItem.created,
      badge: unreadCount.length,
    });
  }),

  handleSetReadNotification: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { notification_id } = req.body;
    // check account
    const [account, notification] = await Promise.all([
      models.accounts.findByPk(accountId, {
        attributes: {
          exclude: ['avatarSrc', 'bgSrc'],
        },
      }),
      models.notifications.findByPk(notification_id),
    ]);
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found user');
    }
    if (account.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'The account was blocked due to violate public standard',
      );
    }
    // check notification
    if (!notification) {
      throw errorUtils.createError(404, 9994, 'Not found notification');
    }
    if (!notification.read) {
      await notification.update({
        read: true,
      });
    }
    const getUnreadNotificationsQuery = utils.createGetUnreadNotificationQuery(accountId);
    const [unreadNotifications] = await models.sequelize.query(getUnreadNotificationsQuery);
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Handling set read notification successfully',
      data: {
        badge: unreadNotifications.length,
        last_update: utils.constructLastUpdate(unreadNotifications),
      },
    });
  }),
};
