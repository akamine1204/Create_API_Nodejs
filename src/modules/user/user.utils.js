const _ = require('lodash');
const { dateUtils } = require('./../../utils');

const editDistance = (s1, s2) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

module.exports = {
  createGetFriendsOfCurrentUserQuery: (currentUserId, offset, limit) =>
    `
    SELECT
        a.id,
        a."name",
        a.phone,
        a."avatarLink",
        a."createdAt"
    FROM
        accounts a
        JOIN friends f ON a.id = f."friendId"
    WHERE
        f."accountId" = ${currentUserId}
    ORDER BY a."createdAt" DESC
    OFFSET ${offset}
    LIMIT ${limit}
  `,

  constructListFriends: (listFriends) => {
    return _.map(listFriends, (friend) => {
      return {
        id: friend.id,
        username: friend.name || friend.phone,
        avatar: friend.avatarLink,
        same_friends: 0,
        created: dateUtils.toLocale(friend.createdAt),
      };
    });
  },

  createGetSuggestedFriendsQuery: (accountId, offset, limit) => {
    return `
    SELECT
      a."id" as "user_id",
      a."name" as "username",
      a."avatarLink" as  "avatar", 
      t."countMutualFriend" as "same_friends"
    FROM
    (
      SELECT
        f."friendId",
        COUNT(f."accountId") as "countMutualFriend"
      FROM
        friends f
      WHERE
        f."accountId" IN (
          SELECT
            f."friendId"
          FROM
            friends f
          WHERE
            f."accountId" = ${accountId}
        )
      GROUP BY
        f."friendId"
      LIMIT
        20
    ) as t
    JOIN accounts a ON a.id = t."friendId"
    OFFSET ${offset}
    LIMIT ${limit}
    `;
  },

  createGetListBlocksQuery: (currentUserId, offset, limit) => `
  select
    a.id,
    a."name",
    a.phone,
    a."avatarLink" as "avatar"
  from
    accounts a
    join blockers b on a.id = b."blockerId"
  where
    b."userId" = ${currentUserId}
  offset ${offset}
  limit ${limit}
  `,

  similarity: (s1, s2) => {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  },

  constructGetUserInfo: (data, currentUserId) => {
    const { friends } = data;
    const friend = _.find(friends, (f) => f.friendId === currentUserId);
    return {
      id: data.id,
      username: data.name || data.phone,
      created: dateUtils.toLocale(data.createdAt),
      description: data.desc,
      avatar: data.avatarLink,
      cover_image: data.bgLink,
      link: data.link,
      city: data.city,
      address: data.address,
      country: data.country,
      listing: friends.length,
      is_friend: currentUserId === data.id || !!friend,
      online: 1,
    };
  },

  isBlock: (blockers, userId) => {
    return !!_.find(blockers, (b) => b.blockerId === userId);
  },

  createSettingPayload: (accountId) => ({
    likeComment: 1,
    fromFriends: 1,
    requestedFriend: 1,
    suggestedFriend: 1,
    birthday: 1,
    video: 1,
    report: 1,
    soundOn: 1,
    notificationOn: 1,
    vibrantOn: 1,
    ledOn: 1,
    accountId,
  }),
};
