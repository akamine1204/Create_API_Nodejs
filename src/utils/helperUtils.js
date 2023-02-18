const dateUtils = require('./dateUtils');
const postStatus = require('./../constants/postStatus');
const _ = require('lodash');

module.exports = {
  createVerifyCode: (verifyCodes) => {
    let code;
    if (!verifyCodes) {
      verifyCodes = [];
    }
    do {
      code = Math.floor(100000 + Math.random() * 900000);
    } while (verifyCodes.includes(code));
    verifyCodes.push(code);
    return code;
  },
  isAccActive: (name, avatarLink) => {
    return name && avatarLink;
  },
  isListImage: (images) => {
    return images.every((img) => {
      const regex = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/;
      return img.includes('photo') || img.includes('image') || regex.test(img);
    });
  },
  isListVideos: (videos) => {
    return videos.every((vd) => {
      const regex =
        '/(http:|https:|)//(player.|www.)?(vimeo.com|youtu(be.com|.be|be.googleapis.com))/(video/|embed/|channels/(?:w+/)|watch?v=|v/)?([A-Za-z0-9._%-]*)(&S+)?/';
      return regex.test(vd);
    });
  },
  constructMedia: (images, videos) => {
    let media = {};
    media.images = images && images.length ? images : null;
    media.videos = videos && videos.length ? videos : null;
    return JSON.stringify(media);
  },
  getKey: (obj) => {
    return Object.keys(obj)[0];
  },
  getValue: (obj) => {
    return Object.values(obj)[0];
  },
  isBlock: (accountId, blockers) => {
    const blocker = blockers.find((b) => {
      return b.blockerId === accountId;
    });
    return !!blocker;
  },
  isLiked: (accountId, likeList) => {
    const account = likeList.find((item) => item.accountId === +accountId);
    return !!account;
  },
  constructPost: (post, likes, comments, user, blockers, accountId) => {
    const media = JSON.parse(post.media);
    const account = likes.find((item) => item.accountId === +accountId);
    const blocker = blockers.find((b) => {
      return b.blockerId === accountId;
    });
    return {
      id: post.id,
      described: post.content,
      created: dateUtils.toLocale(post.createdAt),
      modified: dateUtils.toLocale(post.updatedAt),
      like: likes.length,
      comment: comments.length,
      is_liked: !!account,
      image: media.images,
      video: media.videos,
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatarLink,
        online: true,
      },
      state: post.status,
      is_blocked: !!blocker,
      can_edit:
        post.creatorId === accountId && post.status && !post.status.include(postStatus.LOCKED),
      banned: post.status && post.status.include(postStatus.LOCKED),
      can_comment: post.status && !post.status.include(postStatus.LOCK_COMMENT),
    };
  },
  isPostCanEdit: (status) => {
    return status && !status.includes('locked');
  },
  isPostBanned: (status) => {
    return status && (status.includes('banned') || status.includes('violated'));
  },
  isPostLockComment: (status) => {
    return status && status.includes('lock_comment');
  },
  getInvalidFields: (data, validFields) => {
    return _.filter(Object.keys(data), (field) => {
      return !_.includes(validFields, field);
    });
  },
  compare2Text: (text1, text2) => {
    return text1.trim().toLowerCase() === text2.trim().toLowerCase();
  },

  isLiked: (likes, currentUserId) => {
    const ins = _.find(likes, (item) => +item.accountId === +currentUserId);
    return !!ins;
  },

  getInteractedUsers: (comments, likes) => {
    const users1 = _.map(comments, (data) => {
      return data.account.name || data.account.phone;
    });
    const users2 = _.map(likes, (data) => {
      return data.account.name || data.account.phone;
    });
    const mergeUsers = _.map([...users1, ...users2], (u) => u.trim().toLowerCase());
    return mergeUsers.length ? Array.from(new Set(mergeUsers)).join(',') : null;
  },

  isBlocked: (blockers) => {
    const [item] = blockers;
    return !!item;
  },

  isCanEdit: (post, currentUserId) => {
    return +post.creatorId === +currentUserId && !post.isLocked;
  },

  getState: (post) => {
    return post.isLocked ? 'The post was locked' : 'Available';
  },

  getLastPost: (listPosts) => {
    if (listPosts.length) {
      const lastItem = listPosts[0];
      return lastItem;
    }
    return null;
  },
};
