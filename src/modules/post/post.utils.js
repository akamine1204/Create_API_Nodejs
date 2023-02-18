const _ = require('lodash');
const { dateUtils, helperUtils } = require('./../../utils');

module.exports = {
  constructPost: (post, accountId, blockers) => {
    const {
      media,
      likes,
      comments,
      createdAt,
      updatedAt,
      account,
      postImages,
      postVideo,
      ...rest
    } = post.toJSON();
    const postType = postImages.length ? 'image' : postVideo ? 'video' : 'status';
    return {
      id: rest.id,
      described: rest.content,
      modified: dateUtils.toLocale(updatedAt),
      created: dateUtils.toLocale(createdAt),
      like: likes.length,
      comment: comments.length,
      is_liked: _.find(likes, (item) => item.accountId === accountId),
      image: postImages.length ? _.map(postImages, 'imageUrl') : null,
      video: postVideo ? postVideo.videoLink : null,
      author: {
        id: account.id,
        name: account.name,
        avatar: account.avatarLink,
      },
      is_blocked: !!_.find(blockers, (item) => item.blockerId === accountId),
      can_edit: rest.creatorId === accountId && !rest.isBanned,
      banned: rest.isBanned,
      can_comment: rest.isCanComment,
      url: `${process.env.HOST}/posts/${rest.id}`,
      post_type: postType,
    };
  },

  constructImagesPayload: (images, postId) => {
    if (Array.isArray(images)) {
      return _.map(images, (img, idx) => ({
        postId,
        order: idx,
        size: img.size,
        image: img.buffer,
        type: img.mimetype,
      }));
    } else {
      throw new Error('Images is not iterable');
    }
  },

  constructVideosPayload: (videos, postId) => {
    if (Array.isArray(videos)) {
      return _.map(videos, (video, idx) => ({
        postId,
        order: idx,
        size: video.size,
        video: video.buffer,
        type: video.mimetype,
      }));
    } else {
      throw new Error('Images is not iterable');
    }
  },

  constructGetPost: (post, isBlocked, currentUserId) => {
    const isLiked = _.find(post.likes, (item) => item.accountId === currentUserId);
    const isCanEdit = post.creatorId === currentUserId && !post.isLocked;

    return {
      id: post.id,
      described: post.content,
      created: dateUtils.toLocale(post.createdAt),
      modified: dateUtils.toLocale(post.updatedAt),
      like: post.likes.length,
      comment: post.comments.length,
      is_liked: !!isLiked,
      image: post.postImages.length ? post.postImages : null,
      video: post.postVideos.length ? post.postVideos : null,
      author: post.account,
      state: 'Available',
      is_blocked: isBlocked,
      banned: false,
      can_edit: isCanEdit,
      can_comment: true,
      messages: null,
    };
  },

  constructGetComment: (comments) => {
    return _.map(comments, (ins) => {
      const { account, ...rest } = ins.toJSON();
      return {
        id: rest.id,
        comment: rest.content,
        created: dateUtils.toLocale(rest.createdAt),
        poster: {
          id: account.id,
          name: account.name || account.phone,
          avatar: account.avatarLink,
        },
      };
    });
  },

  constructGetListPosts: (listPosts, currentUserId, last_id) => {
    const lastItem = helperUtils.getLastPost(listPosts);
    return _.map(listPosts, (ins) => {
      const post = ins.toJSON();
      const {
        account: { blockers, ...author },
      } = post;
      return {
        id: post.id,
        name: helperUtils.getInteractedUsers(post.comments, post.likes),
        image: post.postImages.length ? post.postImages : null,
        video: post.postVideos.length ? post.postVideos : null,
        described: post.content,
        created: dateUtils.toLocale(post.createdAt),
        like: post.likes.length,
        comment: post.likes.length,
        is_liked: helperUtils.isLiked(post.likes, currentUserId),
        is_blocked: helperUtils.isBlocked(blockers),
        can_comment: post.isCanComment,
        can_edit: helperUtils.isCanEdit(post, currentUserId),
        banned: false,
        state: helperUtils.getState(post),
        author,
        last_id: lastItem.id,
        new_items: last_id ? lastItem.id - +last_id : listPosts.length,
      };
    });
  },

  constructGetListVideos: (listVideos, currentUserId, last_id) => {
    const lastItem = helperUtils.getLastPost(listVideos);
    return _.map(listVideos, (ins) => {
      const post = ins.toJSON();
      const {
        account: { blockers, ...author },
      } = post;
      return {
        id: post.id,
        name: helperUtils.getInteractedUsers(post.comments, post.likes),
        video: post.postVideos,
        described: post.content,
        created: dateUtils.toLocale(post.createdAt),
        like: post.likes.length,
        comment: post.likes.length,
        is_liked: helperUtils.isLiked(post.likes, currentUserId),
        is_blocked: helperUtils.isBlocked(blockers),
        can_comment: post.isCanComment,
        can_edit: helperUtils.isCanEdit(post, currentUserId),
        banned: false,
        state: helperUtils.getState(post),
        author,
        last_id: lastItem.id,
        new_items: last_id ? lastItem.id - +last_id : listVideos.length,
      };
    });
  },

  constructTitleForNotification: (account, actionType) => {
    const name = account.name || account.phone;
    return `${name} ${actionType} your post`;
  },
};
