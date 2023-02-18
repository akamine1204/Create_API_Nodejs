const models = require('./../../models');
const { errorUtils } = require('./../../utils');

module.exports = {
  checkHostAndPartner: async (req, res, next) => {
    try {
      let hostId, partnerId;
      const { accountId } = req.data;
      const { partner_id, conversation_id } = req.body;
      if (!(partner_id || conversation_id)) {
        return next(errorUtils.createError(400, 1004, 'No partner_id or conversation_id provided'));
      }
      if (partner_id) {
        hostId = accountId;
        partnerId = +partner_id;
      } else {
        const conversation = await models.conversations.findByPk(+conversation_id);
        if (!conversation) {
          return next(errorUtils.createError(404, 9994, 'Not found the conversation'));
        }
        hostId = conversation.hostId;
        partnerId = conversation.partnerId;
      }
      const [host, partner, hostBlockPartner, partnerBlockHost] = await Promise.all([
        models.accounts.findByPk(hostId, {
          attributes: {
            exclude: ['avatarSrc', 'bgSrc'],
          },
        }),
        models.accounts.findByPk(partnerId, {
          attributes: {
            exclude: ['avatarSrc', 'bgSrc'],
          },
        }),
        models.blockers.findOne({
          where: {
            userId: hostId,
            blockerId: partnerId,
          },
        }),
        models.blockers.findOne({
          where: {
            userId: partnerId,
            blockerId: hostId,
          },
        }),
      ]);
      if (!host) {
        return next(errorUtils.createError(404, 9995, 'Not found host'));
      }
      if (!host.isActive) {
        return next(
          errorUtils.createError(
            403,
            9995,
            'Your account does not activate. Please activate it and try again'
          )
        );
      }
      if (host.isBlocked) {
        return next(
          errorUtils.createError(
            403,
            9995,
            'Your account was blocked due to violate public standard'
          )
        );
      }
      if (!partner) {
        return next(errorUtils.createError(404, 9995, 'Not found receiver'));
      }
      if (!partner.isActive) {
        return next(
          errorUtils.createError(403, 9995, 'The receiver does not activate. Please try it again')
        );
      }
      if (partner.isBlocked) {
        return next(
          errorUtils.createError(
            403,
            9995,
            'The receiver was blocked due to violate public standard'
          )
        );
      }
      if (partnerBlockHost) {
        return next(
          errorUtils.createError(403, 9994, 'This user blocked you. Please try it later')
        );
      }
      if (hostBlockPartner) {
        req.is_blocked = '1';
      }
      req.hostId = hostId;
      req.partnerId = partnerId;
      return next();
    } catch (error) {
      return next(error);
    }
  },

  checkConversation: async (req, res, next) => {
    try {
      let hostId, partnerId;
      const { accountId } = req.data;
      const { partner_id, conversation_id } = req.body;
      if (!(partner_id || conversation_id)) {
        return next(errorUtils.createError(400, 1004, 'No partner_id or conversation_id provided'));
      }
      if (partner_id) {
        hostId = accountId;
        partnerId = +partner_id;
      } else {
        const conversation = await models.conversations.findByPk(+conversation_id);
        if (!conversation) {
          return next(errorUtils.createError(404, 9994, 'Not found the conversation'));
        }
        hostId = conversation.hostId;
        partnerId = conversation.partnerId;
      }
      const [host, partner] = await Promise.all([
        models.accounts.findByPk(hostId, {
          attributes: {
            exclude: ['avatarSrc', 'bgSrc'],
          },
        }),
        models.accounts.findByPk(partnerId, {
          attributes: {
            exclude: ['avatarSrc', 'bgSrc'],
          },
        }),
      ]);
      if (!host) {
        return next(errorUtils.createError(404, 9995, 'Not found host'));
      }
      if (!host.isActive) {
        return next(
          errorUtils.createError(
            403,
            9995,
            'Your account does not activate. Please activate it and try again'
          )
        );
      }
      if (host.isBlocked) {
        return next(
          errorUtils.createError(
            403,
            9995,
            'Your account was blocked due to violate public standard'
          )
        );
      }
      if (!partner) {
        return next(errorUtils.createError(404, 9995, 'Not found receiver'));
      }
      if (!partner.isActive) {
        return next(
          errorUtils.createError(403, 9995, 'The receiver does not activate. Please try it again')
        );
      }
      if (partner.isBlocked) {
        return next(
          errorUtils.createError(
            403,
            9995,
            'The receiver was blocked due to violate public standard'
          )
        );
      }
      req.hostId = hostId;
      req.partnerId = partnerId;
      return next();
    } catch (error) {
      return next(error);
    }
  },
};
