const _ = require('lodash');
const { dateUtils } = require('./../../utils');

module.exports = {
  createGetListConversationQuery: (accountId, offset, limit) => {
    return `
    select
      a.id as "partner_id",
      a.phone,
      a."name",
      a."avatarLink" as "avatar", 
      m.id as "message_id",
      m.message, 
      m.read,
      m."createdAt" as "created", 
      c."id" as "conversation_id"
    from
      accounts a
      join conversations c on a.id = c."partnerId"
      and c."hostId" = ${accountId}
      join messages m on m."conversationId" = c.id
    order by 
      m."createdAt" desc
    offset ${offset}
    limit ${limit}
    `;
  },
  constructGetListConversation: (data) => {
    let results = [];
    let conversations = _.groupBy(data, 'conversation_id');
    for (const room of Object.keys(conversations)) {
      const [lastItem] = conversations[room].sort((a, b) => b.message_id - a.message_id);
      results.push({
        id: room,
        Partner: {
          id: lastItem.partner_id,
          username: lastItem.name || lastItem.phone,
          avatar: lastItem.avatar,
        },
        LastMessage: {
          message: lastItem.message,
          created: dateUtils.toLocale(lastItem.created),
          unread: lastItem.read,
        },
      });
    }
    const unreadMsgs = _.filter(results, (item) => !+item.LastMessage.unread);
    return {
      data: results,
      numNewMessage: unreadMsgs.length,
    };
  },
  createGetConversationByRoomId: (conversationId, offset, limit) => `
  select
    m.id as "message_id",
    m.message,
    m."read" as "unread",
    m."createdAt" as "created",
    a.id as "sender_id",
    a.name as "sender_name",
    a.phone,
    a."avatarLink" as "avatar"
  from
    messages as m,
    accounts a
  where
    m."conversationId" IN (
      select
        cv.id as conversationId from conversations cv, (
          select
            c. "hostId", c. "partnerId" from conversations c
          where
            c.id = ${conversationId}) AS t
        where (cv."hostId" = t."hostId"
          and cv."partnerId" = t."partnerId")
        or (cv."hostId" = t."partnerId"
          and cv."partnerId" = t."hostId"))
    and m.sender = a.id
  order by
    m."createdAt"
  offset ${offset}
  limit ${limit}
  `,
  createGetConversationByPartnerId: (hostId, partnerId, offset, limit) => `
  select
	m.id AS "message_id",
	m.message,
  m."isDeleted" as "is_deleted",
	m."read",
	m."createdAt" AS "created",
	a.id AS "sender_id",
	a.name AS "sender_name",
	a.phone,
	a."avatarLink" AS "avatar"
  from
    messages AS m,
    accounts a
  where
    m. "conversationId" in (
      select
        cv.id AS conversationId from conversations cv
      where (cv. "hostId" = ${hostId}
        and cv. "partnerId" = ${partnerId})
      or (cv. "hostId" = ${partnerId}
        and cv. "partnerId" = ${hostId}))
    and m.sender = a.id
    order BY m."createdAt"
  offset ${offset}
  limit ${limit}
    `,
  constructGetConversation: (data, is_blocked) => {
    return {
      conversation: _.map(data, (item) => ({
        message: item.message,
        message_id: item.message_id,
        is_deleted: item.is_deleted,
        unread: item.read,
        created: dateUtils.toLocale(item.created),
        sender: {
          id: item.sender_id,
          username: item.sender_name || item.sender_phone,
          avatar: item.avatar,
        },
        is_blocked: is_blocked ? '1' : '0',
      })),
    };
  },

  createGetUnreadMessage: (hostId, partnerId) => `
  select
    m.id AS "message_id",
    m.message,
    m."read",
    m."isDeleted" as "is_deleted",
    m."createdAt" AS "created",
    a.id AS "sender_id",
    a.name AS "sender_name",
    a.phone,
    a. "avatarLink" AS "avatar"
  from
    messages AS m,
    accounts a
  where
    m."conversationId" in (
      select
        cv.id AS conversationId from conversations cv
      where (cv. "hostId" = ${hostId}
        and cv. "partnerId" = ${partnerId})
      or (cv. "hostId" = ${partnerId}
        and cv. "partnerId" = ${hostId}))
    and m."read" = '0'
    and m."sender" = a.id
    order BY m."createdAt"
  `,

  constructSetReadMessage: (data) => {
    return _.map(data, (item) => {
      const { created, sender_id, sender_name, phone, avatar, read, ...rest } = item;
      return {
        ...rest,
        unread: '1',
        created: dateUtils.toLocale(created),
        sender: {
          id: sender_id,
          name: sender_name || phone,
          avatar,
        },
      };
    });
  },

  createDeleteMessageQuery: (hostId, partnerId, messageId) => `
  select
    m.id AS "message_id",
    m.message,
    m."read",
    m."isDeleted" as "is_deleted",
    m."createdAt" AS "created",
    a.id AS "sender_id",
    a.name AS "sender_name",
    a.phone,
    a. "avatarLink" AS "avatar"
  from
    messages AS m,
    accounts a
  where
    m."conversationId" in (
      select
        cv.id AS conversationId from conversations cv
      where (cv. "hostId" = ${hostId}
        and cv. "partnerId" = ${partnerId})
      or (cv. "hostId" = ${partnerId}
        and cv. "partnerId" = ${hostId}))
    and m."sender" = a.id
    and m.id = ${messageId}
    order BY m."createdAt"
  `,

  constructDeleteMessage: (message) => {
    const { created, sender_id, sender_name, phone, avatar, read, ...rest } = message;
    return {
      ...rest,
      unread: '1',
      is_deleted: '1',
      created: dateUtils.toLocale(created),
      sender: {
        id: sender_id,
        name: sender_name || phone,
        avatar,
      },
    };
  },
};
