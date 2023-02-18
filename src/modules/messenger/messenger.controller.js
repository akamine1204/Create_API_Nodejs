const models = require('../../models');
const { errorUtils, catchAsync } = require('../../utils');
const utils = require('./messenger.utils');

module.exports = {
  handleGetListConversation: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { index, count } = req.body;
    const account = await models.accounts.findByPk(accountId, {
      attributes: {
        exclude: ['bgSrc', 'avatarSrc'],
      },
    });
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found user');
    }
    if (account.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'The account was blocked due to violate public standard'
      );
    }
    const query = utils.createGetListConversationQuery(accountId, index, count);
    const [results] = await models.sequelize.query(query);
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Handling get list conversation successfully',
      ...utils.constructGetListConversation(results),
    });
  }),

  handleSetMessage: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { receiver_id, message } = req.body;
    // check users
    const [sender, receiver, blocker, conservation] = await Promise.all([
      models.accounts.findByPk(accountId, {
        attributes: {
          exclude: ['avatarSrc', 'bgSrc'],
        },
      }),
      models.accounts.findByPk(+receiver_id, {
        attributes: {
          exclude: ['avatarSrc', 'bgSrc'],
        },
      }),
      models.blockers.findOne({
        where: {
          userId: +receiver_id,
          blockerId: accountId,
          type: 'block',
        },
      }),
      models.conversations.findOne({
        where: {
          hostId: accountId,
          partnerId: +receiver_id,
        },
      }),
    ]);
    // Check sender
    if (!sender) {
      throw errorUtils.createError(404, 9995, 'Not found sender');
    }
    if (sender.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'The account was blocked due to violate public standard'
      );
    }
    if (!receiver) {
      throw errorUtils.createError(404, 9995, 'Not found receiver');
    }
    if (receiver.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'The receiver was blocked due to violate public standard'
      );
    }
    if (blocker) {
      return res.status(200).json({
        code: 1000,
        message: 'The receiver was block you',
      });
    }
    // Success
    let room = conservation;
    if (!room) {
      room = await models.conversations.create({
        hostId: accountId,
        partnerId: receiver_id,
      });
    }
    await models.messages.create({
      conversationId: room.id,
      message,
      read: +receiver_id === accountId ? '1' : '0',
      sender: accountId,
    });
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Handling set message successfully',
    });
  }),

  handleGetConversation: catchAsync(async (req, res) => {
    let blocker;
    let hostId;
    let partnerId;
    const { accountId } = req.data;
    const { partner_id, conversation_id, index, count } = req.body;
    if (!(partner_id || conversation_id)) {
      throw errorUtils.createError(400, 1004, 'No partner_id or conversation_id provided');
    }
    if (partner_id) {
      hostId = accountId;
      partnerId = +partner_id;
    } else {
      const conversation = await models.conversations.findByPk(+conversation_id);
      hostId = conversation.hostId;
      partnerId = conversation.partnerId;
    }
    const [sender, receiver] = await Promise.all([
      models.accounts.findByPk(hostId, {
        attributes: {
          exclude: ['bgSrc', 'avatarSrc'],
        },
      }),
      models.accounts.findByPk(partnerId, {
        attributes: {
          exclude: ['bgSrc', 'avatarSrc'],
        },
      }),
    ]);
    if (!sender) {
      throw errorUtils.createError(404, 9995, 'Not found sender');
    }
    if (sender.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'The account was blocked due to violate public standard'
      );
    }
    if (!receiver) {
      throw errorUtils.createError(404, 9995, 'Not found receiver');
    }
    if (receiver.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'The receiver was blocked due to violate public standard'
      );
    }
    blocker = await models.blockers.findOne({
      where: {
        userId: partnerId,
        blockerId: hostId,
        type: 'block',
      },
    });
    let query = utils.createGetConversationByPartnerId(hostId, partnerId, index, count);
    const [results] = await models.sequelize.query(query);
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Handling get conversation successfully',
      data: utils.constructGetConversation(results, blocker),
    });
  }),

  handleSeReadMessage: catchAsync(async (req, res) => {
    const { hostId, partnerId } = req;
    const query = utils.createGetUnreadMessage(hostId, partnerId);
    const [results] = await models.sequelize.query(query);
    for (const record of results) {
      await models.messages.update({ read: '1' }, { where: { id: record.message_id } });
    }
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Handling set read message successfully',
      data: utils.constructSetReadMessage(results),
      is_blocked: req.is_blocked,
    });
  }),

  handleDeleteMessage: catchAsync(async (req, res) => {
    const { hostId, partnerId } = req;
    const { message_id } = req.body;
    const query = utils.createDeleteMessageQuery(hostId, partnerId, message_id);
    const [[message]] = await models.sequelize.query(query);
    if (!message) {
      throw errorUtils.createError(404, 9992, 'Not found message');
    }
    if (message.is_deleted === '1') {
      throw errorUtils.createError(400, 1004, 'The message was already deleted');
    }
    await models.messages.update(
      {
        isDeleted: '1',
      },
      {
        where: {
          id: message.message_id,
        },
      }
    );
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Handling deleting message successfully',
      data: utils.constructDeleteMessage(message),
    });
  }),

  handleDeleteConversation: catchAsync(async (req, res) => {
    const { hostId, partnerId } = req;
    const conversation = await models.conversations.findOne({
      where: {
        hostId,
        partnerId,
      },
    });
    if (!conversation) {
      throw errorUtils.createError(404, 9992, 'Not found conversation');
    }
    if (conversation.hostId !== hostId) {
      throw errorUtils.createError(403, 1004, `Can't delete someone else's chat`);
    }
    await conversation.destroy();
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Handling delete conversation successfully',
    });
  }),
};
