require('dotenv').config();
const _ = require('lodash');
const { Op } = require('sequelize');
const models = require('../../models');
const { catchAsync, errorUtils, dateUtils, sessionUtils, helperUtils } = require('./../../utils');
const utils = require('./post.utils');

const constructPost = (req, post, accountId, blockers) => {
  const { media, likes, comments, createdAt, updatedAt, account, postImages, postVideo, ...rest } =
    post.toJSON();
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
};

module.exports = {
  handleGetListPosts: catchAsync(async (req, res) => {
    const { user_id, index, count, last_id } = req.body;
    const posts = await models.posts.findAll({
      order: [['createdAt', 'desc']],
      offset: index,
      limit: count,
      include: [
        {
          model: models.likes,
          include: [
            {
              model: models.accounts,
              required: false,
              attributes: ['name', 'phone'],
            },
          ],
        },
        {
          model: models.comments,
          include: [
            {
              model: models.accounts,
              required: false,
              attributes: ['name', 'phone'],
            },
          ],
        },
        {
          model: models.accounts,
          attributes: ['id', 'name', 'phone', 'avatarLink'],
          include: [
            {
              model: models.blockers,
              required: false,
              where: {
                blockerId: +user_id,
              },
            },
          ],
        },
        {
          model: models.postImages,
          attributes: ['id', ['imageUrl', 'url']],
          order: [['order', 'ASC']],
        },
        {
          model: models.postVideos,
          attributes: [
            ['videoLink', 'url'],
            ['thumbnail', 'thumb'],
          ],
          order: [['order', 'ASC']],
        },
      ],
    });
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Getting list posts successfully',
      data: utils.constructGetListPosts(posts, user_id, last_id),
    });
  }),

  handleGetPost: catchAsync(async (req, res) => {
    const { id } = req.body;
    const { accountId } = req.data;
    const post = await models.posts.findByPk(+id, {
      include: [
        {
          model: models.comments,
        },
        {
          model: models.likes,
        },
        {
          model: models.accounts,
          attributes: ['id', 'name', 'phone', 'avatarLink'],
          order: [['order', 'ASC']],
        },
        {
          model: models.postImages,
          attributes: ['id', ['imageUrl', 'url']],
          order: [['order', 'ASC']],
        },
        {
          model: models.postVideos,
          attributes: [['videoLink', 'url'], 'thumbnail'],
        },
      ],
    });
    if (!post) {
      throw errorUtils.createError(404, 9992, 'Not found post');
    }
    const blocker = await models.blockers.findOne({
      where: {
        userId: post.creatorId,
        blockerId: accountId,
      },
    });
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Getting post successfully',
      data: utils.constructGetPost(post.toJSON(), !!blocker, accountId),
    });
  }),

  handleAddPost: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { described, status } = req.body;

    // Check user
    const account = await models.accounts.findByPk(accountId, {
      attributes: [['id', 'accountId'], 'name', 'phone'],
    });
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found creator');
    }
    // Create post
    const post = await models.posts.create({
      creatorId: accountId,
      content: described,
      status,
    });
    // Insert images
    if (req.images) {
      const imagesPayload = utils.constructImagesPayload(req.images, post.id);
      for (const payload of imagesPayload) {
        const ins = await models.postImages.create(payload);
        await ins.update({ imageUrl: `${process.env.BASE_URL_IMG_POST}/${ins.id}` });
      }
    } else if (req.videos) {
      // Insert videos
      const videosPayload = utils.constructVideosPayload(req.videos, post.id);
      for (const payload of videosPayload) {
        const ins = await models.postVideos.create(payload);
        await ins.update({ videoLink: `${process.env.BASE_URL_VIDEO_POST}/${ins.id}` });
      }
    }
    // Return response
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Adding post successfully',
      data: {
        id: post.id,
        url: `${process.env.HOST}/posts/${post.id}`,
      },
    });
  }),

  handleEditPost: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { token, id, ...payload } = req.body;
    return res.status(200).json({ code: 1000, message: 'Ok - Updating post successfully' });
  }),

  handleDeletePost: catchAsync(async (req, res) => {
    const { id } = req.body;
    const { accountId } = req.data;
    const post = await models.posts.findByPk(+id);
    if (accountId !== post.creatorId) {
      throw errorUtils.createError(
        403,
        1009,
        'You can not delete this post because you do not create it'
      );
    }
    await Promise.all([
      models.likes.destroy({ where: { postId: id } }),
      models.comments.destroy({ where: { postId: id } }),
      models.reports.destroy({ where: { postId: id } }),
      models.postImages.destroy({ where: { postId: id } }),
      models.postVideos.destroy({ where: { postId: id } }),
    ]);
    await post.destroy();
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Deleting post successfully',
    });
  }),

  handleReportPost: catchAsync(async (req, res) => {
    const { id, subject, details } = req.body;
    const { accountId } = req.data;
    if (req.post.creatorId === accountId) {
      throw errorUtils.createError(400, 1004, 'Can not self-report your own posts');
    }
    await models.reports.create({
      postId: +id,
      reporterId: accountId,
      subject,
      details,
    });
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Reporting port successfully',
    });
  }),

  handleLikePost: catchAsync(async (req, res) => {
    const { id } = req.body;
    const { accountId } = req.data;
    await models.likes.create({
      postId: +id,
      accountId,
    });
    if (accountId !== req.post.creatorId) {
      await models.notifications.create({
        type: 'like',
        title: `${utils.constructTitleForNotification(req.account, 'liked')}`,
        read: false,
        group: 0,
        objectId: req.post.id,
        creatorId: accountId,
        accountId: req.post.creatorId,
      });
    }
    const likeCount = await models.likes.count({
      where: {postId: +id,}
      
    });
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Liking post successfully',
      data: {
        like: likeCount,
      },
    });
  }),

  handleSetComment: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { id, comment, count, index } = req.body;
    await models.comments.create({
      writerId: accountId,
      content: comment,
      postId: +id,
    });
    if (accountId !== req.post.creatorId) {
      await models.notifications.create({
        type: 'comment',
        title: `${utils.constructTitleForNotification(req.account, 'commented')}`,
        read: false,
        group: 0,
        objectId: req.post.id,
        creatorId: accountId,
        accountId: req.post.creatorId,
      });
    }
    const comments = await models.comments.findAll({
      where: {
        postId: +id,
      },
      order: [['createdAt', 'desc']],
      limit: count,
      offset: index,
      include: [
        {
          model: models.accounts,
          attributes: ['id', 'name', 'avatarLink', 'phone'],
        },
      ],
    });
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Setting comment successfully',
      data: utils.constructGetComment(comments),
    });
  }),

  handleGetComment: catchAsync(async (req, res) => {
    const { id, count, index } = req.body;
    const comments = await models.comments.findAll({
      where: {
        postId: +id,
      },
      order: [['createdAt', 'desc']],
      limit: count,
      offset: index,
      include: [
        {
          model: models.accounts,
          attributes: ['id', 'name', 'avatarLink', 'phone'],
        },
      ],
    });
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Getting list comment of post successfully',
      data: utils.constructGetComment(comments),
    });
  }),

  handleCheckNewItem: catchAsync(async (req, res) => {
    const { last_id, category_id = 0 } = req.body;
    const posts = await models.posts.findAll({
      limit: 1,
      attributes: ['id'],
      order: [['createdAt', 'DESC']],
    });
    const [lastPost] = posts;
    let newItemCount = 0;
    if (+last_id < lastPost.id) {
      newItemCount = lastPost.id - +last_id;
    }
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Checking new item successfully',
      data: [{ new_items: `${newItemCount}` }],
    });
  }),

  handleSearch: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { keyword, user_id, index, count } = req.body;
    const [posts] = await Promise.all([
      models.posts.findAll({
        order: [['createdAt', 'desc']],
        offset: index,
        limit: count,
        where: {
          content: {
            [Op.iLike]: `%${keyword}%`,
          },
          creatorId: +user_id,
        },
        include: [
          {
            model: models.likes,
            include: [
              {
                model: models.accounts,
                required: false,
                attributes: ['name', 'phone'],
              },
            ],
          },
          {
            model: models.comments,
            include: [
              {
                model: models.accounts,
                required: false,
                attributes: ['name', 'phone'],
              },
            ],
          },
          {
            model: models.accounts,
            attributes: ['id', 'name', 'phone', 'avatarLink'],
            include: [
              {
                model: models.blockers,
                required: false,
                where: {
                  blockerId: +user_id,
                },
              },
            ],
          },
          {
            model: models.postImages,
            attributes: ['id', ['imageUrl', 'url']],
            order: [['order', 'ASC']],
          },
          {
            model: models.postVideos,
            attributes: [
              ['videoLink', 'url'],
              ['thumbnail', 'thumb'],
            ],
            order: [['order', 'ASC']],
          },
        ],
      }),
      models.savedKeywords.findOrCreate({
        where: {
          accountId,
          keyword: { [Op.iLike]: keyword },
        },
        defaults: { keyword },
      }),
    ]);
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Handling search successfully',
      data: _.map(posts, (ins) => {
        const post = ins.toJSON();
        const {
          account: { blockers, ...author },
        } = post;
        return {
          id: post.id,
          image: post.postImages.length ? post.postImages : null,
          video: post.postVideos.length ? post.postVideos : null,
          like: post.likes.length,
          comment: post.likes.length,
          is_liked: helperUtils.isLiked(post.likes, accountId),
          author,
          described: post.content,
        };
      }),
    });
  }),

  handleGetSavedKeyword: catchAsync(async (req, res) => {
    const { index, count } = req.body;
    const { accountId } = req.data;
    const keywords = await models.savedKeywords.findAll({
      offset: index,
      limit: count,
      order: [['id', 'DESC']],
      where: {
        accountId: +accountId,
      },
    });
    const results = _.map(keywords, (ins) => {
      const { id, keyword, createdAt } = ins.toJSON();
      return {
        id,
        keyword,
        created: dateUtils.toLocale(createdAt),
      };
    });
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Getting saved keyword successfully',
      data: results,
    });
  }),

  handleDeleteSavedSearch: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { search_id, all } = req.body;
    const isInvalidSearchId = _.isNil(search_id) || !search_id.trim();
    const isInvalidAll = _.isNil(all) || !all.trim();
    if (isInvalidSearchId && isInvalidAll) {
      throw errorUtils.createError(400, 1004, 'Error: can not handle your unclarified request');
    }
    if (search_id && all) {
      throw errorUtils.createError(
        404,
        1004,
        'Can not execute remove a saved keyword and remove all keyword at the same time'
      );
    }
    if (search_id) {
      const savedKeyword = await models.savedKeywords.findByPk(+search_id);
      if (!savedKeyword) {
        throw errorUtils.createError(404, 1009, 'Not found your saved keyword');
      }
      await savedKeyword.destroy();
    } else {
      await models.savedKeywords.destroy({ where: { accountId: +accountId } });
    }
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Deleting saved search successfully',
    });
  }),

  handleGetPostImg: catchAsync(async (req, res) => {
    const { imgId } = req.params;
    const data = await models.postImages.findByPk(+imgId, {
      raw: true,
      attributes: ['type', 'image'],
    });
    if (!data) {
      throw errorUtils.createError(404, 9994, 'Not found image');
    }
    if (!data.image) {
      return res.status(200).sendFile(path.resolve(__dirname, '..', '..', 'assets', 'no-data.jpg'));
    }
    return res.header('Content-Type', data.type).status(200).send(data.image);
  }),

  handleGetPostVideo: catchAsync(async (req, res) => {
    const { videoId } = req.params;
    const data = await models.postVideos.findByPk(+videoId, {
      raw: true,
      attributes: ['type', 'video'],
    });
    if (!data) {
      throw errorUtils.createError(404, 9994, 'Not found video');
    }
    if (!data.video) {
      return res.status(200).sendFile(path.resolve(__dirname, '..', '..', 'assets', 'no-data.jpg'));
    }
    return res.header('Content-Type', data.type).status(200).send(data.video);
  }),

  handleGetListVideos: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { user_id, index, count, last_id } = req.body;
    const listVideos = await models.posts.findAll({
      offset: index,
      limit: count,
      where: {
        creatorId: +user_id,
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: models.likes,
          include: [
            {
              model: models.accounts,
              required: false,
              attributes: ['name', 'phone'],
            },
          ],
        },
        {
          model: models.comments,
          include: [
            {
              model: models.accounts,
              required: false,
              attributes: ['name', 'phone'],
            },
          ],
        },
        {
          model: models.accounts,
          attributes: ['id', ['name', 'username'], ['avatarLink', 'avatar'], 'phone'],
          include: [
            {
              model: models.blockers,
              required: false,
              where: {
                blockerId: accountId,
              },
            },
          ],
        },
        {
          model: models.postVideos,
          required: true,
          attributes: [
            ['thumbnail', 'thumb'],
            ['videoLink', 'url'],
          ],
          order: [['order', 'ASC']],
        },
      ],
    });
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Getting list videos successfully',
      data: utils.constructGetListVideos(listVideos, user_id, last_id),
    });
  }),
};
