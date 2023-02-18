const _ = require('lodash');
const { dateUtils } = require('./../../utils');

module.exports = {
  constructGetNotification: (listNotification) => {
    return _.map(listNotification, (data) => {
      const { createdAt, read, group, ...rest } = data;
      return {
        ...rest,
        group: +group,
        read: read ? 1 : 0,
        created: dateUtils.toLocale(createdAt),
      };
    });
  },

  createGetNotificationQuery: (accountId, offset, limit) => {
    return `
      select
        n."type" as "type", 
        n."objectId" as "object_id", 
        n.title, 
        n.id as "notification_id",
        n."createdAt", 
        n."group",
        n."read", 
        a."avatarLink" as "avatar"
      from
        notifications n
        join accounts a on n."creatorId" = a.id
      where 
        n."accountId" = ${accountId}
      order by 
        n."createdAt" desc
      offset ${offset}
      limit ${limit}
    `;
  },

  createGetUnreadNotificationQuery: (accountId) => {
    return `
    select
      n."type" as "type", 
      n."objectId" as "object_id", 
      n.title, 
      n.id as "notification_id",
      n."createdAt", 
      n."group",
      n."read", 
      a."avatarLink" as "avatar"
    from
      notifications n
      join accounts a on n."creatorId" = a.id
    where 
      n."accountId" = ${accountId} and
      n.read = FALSE
    order by 
      n."createdAt" desc
    `;
  },

  constructLastUpdate: (notifications) => {
    const [lastItem] = notifications;
    return lastItem ? dateUtils.toLocale(lastItem.createdAt) : undefined;
  },
};
