require('dotenv').config();
const _ = require('lodash');
const path = require('path');
const { Op } = require('sequelize');
const utils = require('./user.utils');

const models = require('../../models');
const { dateUtils, errorUtils, catchAsync, passwordUtils } = require('./../../utils');

const mappingFields = {
  like_comment: 'likeComment',
  from_friends: 'fromFriends',
  requested_friend: 'requestedFriend',
  suggested_friend: 'suggestedFriend',
  birthday: 'birthday',
  video: 'video',
  report: 'report',
  sound_on: 'soundOn',
  notification_on: 'notificationOn',
  vibrant_on: 'vibrantOn',
  led_on: 'ledOn',
};

const updateMappingFields = {
  description: 'desc',
  username: 'name',
  address: 'address',
  city: 'city',
  country: 'country',
  link: 'link',
};

module.exports = {
  handleChangeInfoAfterSignUp: catchAsync(async (req, res) => {
    const { username } = req.body;
    const { accountId, phone } = req.data;
    if (username === phone) {
      throw errorUtils.createError(400, statusCode[1004], 'The username can not be same as phone');
    }
    // Find account
    const [account, anotherAcc] = await Promise.all([
      models.accounts.findByPk(+accountId),
      models.accounts.findOne({
        where: {
          id: { [Op.ne]: +accountId },
          name: {
            [Op.iLike]: username,
          },
        },
      }),
    ]);
    // Check existed
    if (!account) {
      throw errorUtils.createError(404, statusCode[9995], statusMessage[9995]);
    }
    // Check username was existed
    if (anotherAcc) {
      throw errorUtils.createError(
        400,
        statusCode[1004],
        'The username was exist. Please choose another one',
      );
    }
    // check isEqual username
    const { isBlocked, countViolation } = account.toJSON();
    if (isBlocked) {
      throw errorUtils.createError(
        403,
        9991,
        'Account was locked. Please follow below this way to unlock it',
      );
    }
    const blackListUsername = process.env.BLACK_LIST_USER_NAME;
    if (blackListUsername.includes(username.trim().toLowerCase())) {
      // Check is blocked
      if (countViolation >= 3) {
        await account.update({
          isBlocked: true,
          countViolation: 0,
        });
        throw errorUtils.createError(
          403,
          9995,
          'Your account was locked due to violate public standard',
        );
      } else {
        await account.increment('countViolation', { by: 1 });
        throw errorUtils.createError(
          400,
          1004,
          'Your username is invalid maybe it was banned, please choose an another one',
        );
      }
    }
    // Update user
    account.set({
      name: username,
      isActive: true,
    });
    if (req.file) {
      if (req.file.size > 1048576) {
        throw errorUtils.createError(
          400,
          1004,
          'The avatar file is too large. It should be less than 10MB',
        );
      }
      account.set({
        avatarSrc: req.file.buffer,
        avatarLink: `${process.env.BASE_URL_AVATAR}/${account.id}`,
        avatarType: req.file.mimetype,
      });
    }
    await Promise.all([
      account.save(),
      models.settings.create({
        accountId: account.id,
      }),
    ]);
    await account.reload();

    return res.status(200).json({
      code: 1000,
      message: 'Ok - Changing info successfully',
      data: {
        id: account.id,
        phone: account.phone,
        token: account.token,
        username: account.name,
        avatar: account.avatarLink,
        created: dateUtils.toLocale(account.createdAt),
      },
    });
  }),

  handleGetRequestedFriends: catchAsync(async (req, res) => {
    const { index, count } = req.body;
    const { accountId } = req.data;
    // check account
    const account = await models.accounts.findByPk(+accountId);
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found user');
    }
    // Check activate
    if (!account.isActive) {
      throw errorUtils.createError(
        400,
        9995,
        'Your account does not activate. Please activate account and try again',
      );
    }
    // Check lock
    if (account.isBlocked) {
      throw errorUtils.createError(
        403,
        9991,
        'Request failed. Because your account was locked due to some reasons',
      );
    }
    const [results] = await models.sequelize.query(
      `
      SELECT
        rq.id as "rq_id",
        a.id as "user_id",
        a."name" as "username",
        a."avatarLink" as "avatar", 
        rq."createdAt" as "created"
      FROM
        "requestAddFriends" rq
        JOIN accounts a ON a.id = rq."senderId"
      WHERE
        rq."receiverId" = ${accountId}
      OFFSET ${index}
      LIMIT ${count}
      `,
    );
    const resValues = _.map(results, (data) => ({
      ...data,
      created: dateUtils.toLocale(data.created),
    }));
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Getting requested friend successfully',
      data: resValues,
    });
  }),

  handleSetRequestFriend: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { user_id: receiverId } = req.body;
    const [sender, receiver, request, friend] = await Promise.all([
      models.accounts.findByPk(accountId, {
        attributes: {
          exclude: ['bgSrc', 'avatarSrc'],
        },
      }),
      models.accounts.findByPk(+receiverId, {
        attributes: {
          exclude: ['bgSrc', 'avatarSrc'],
        },
      }),
      models.requestAddFriends.findOne({
        senderId: accountId,
        receiverId: +receiverId,
      }),
      models.friends.findOne({
        where: {
          accountId,
          friendId: receiverId,
        },
      }),
    ]);
    if (accountId === +receiverId) {
      throw errorUtils.createError(400, 1004, 'The sender can not same as receiver');
    }
    // Check sender
    if (!sender) {
      throw errorUtils.createError(404, 9995, 'Not found sender');
    }
    // Check receiver
    if (!receiver) {
      throw errorUtils.createError(404, 9995, 'Not found receiver');
    }
    // Check is activate sender
    if (!sender.isActive) {
      throw errorUtils.createError(
        400,
        1010,
        'Your account was blocked due to violate public standard',
      );
    }
    // Check is blocked sender
    if (sender.isBlocked) {
      throw errorUtils.createError(
        403,
        9991,
        'Your account was locked. Please follow below this way to unlock it',
      );
    }
    // Check is activate receiver
    if (!receiver.isActive) {
      throw errorUtils.createError(400, 9995, 'Receiver does not activate');
    }
    // Check is blocked receiver
    if (receiver.isBlocked) {
      throw errorUtils.createError(
        403,
        9991,
        'Receiver was locked. Please follow below this way to unlock it',
      );
    }
    // Check maxFriendCount
    const currentFriendCount = await sender.countFriends();
    const maxFriendCount = sender.maxFriendCount;
    if (currentFriendCount + 1 > maxFriendCount) {
      throw errorUtils.createError(
        400,
        9994,
        'The request could not be submitted because your number of friends is currently maxed',
      );
    }
    // check friend
    if (friend) {
      throw errorUtils.createError(400, 1004, 'The receiver is already your friend');
    }
    // Check existed request
    if (request) {
      await request.destroy();
      return res.status(200).json({
        code: 1000,
        message: 'OK - Canceling request add friend successfully',
      });
    }
    await Promise.all([
      models.requestAddFriends.create({
        senderId: accountId,
        receiverId: +receiverId,
      }),
      models.notifications.create({
        type: 'request_add_friend',
        objectId: receiverId,
        title: `You have a request friend from ${sender.name || sender.phone}`,
        group: 1,
        read: false,
        accountId: receiverId,
        creatorId: accountId,
      }),
    ]);
    const totalRequest = await sender.countRequestAddFriends();
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Setting add request friend successfully',
      data: {
        requested_friends: totalRequest,
      },
    });
  }),

  handleSetAcceptFriend: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { user_id: receiverId, is_accept } = req.body;
    const [request, sender, receiver] = await Promise.all([
      models.requestAddFriends.findOne({
        where: {
          senderId: +receiverId,
          receiverId: +accountId,
        },
      }),
      models.accounts.findByPk(accountId, {
        attributes: {
          exclude: ['bgSrc', 'avatarSrc'],
        },
      }),
      models.accounts.findByPk(+receiverId, {
        attributes: {
          exclude: ['bgSrc', 'avatarSrc'],
        },
      }),
    ]);
    // check sender
    if (!sender) {
      throw errorUtils.createError(404, 9995, 'Not found sender');
    }
    if (sender.isBlocked) {
      throw errorUtils.createError(
        403,
        1004,
        'The sender was blocked due to violate public standard',
      );
    }
    // check sender
    if (!receiver) {
      throw errorUtils.createError(404, 9995, 'Not found receiver');
    }
    if (receiver.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'The receiver was blocked due to violate public standard',
      );
    }
    if (!request) {
      throw errorUtils.createError(404, 1009, 'Can not find request');
    }
    const isAgree = Boolean(+is_accept);
    await request.destroy();
    if (isAgree) {
      await Promise.all([
        models.friends.create({
          accountId,
          friendId: +receiverId,
        }),
        models.notifications.create({
          type: 'accept_request_friend',
          objectId: receiverId,
          title: `${receiver.name || receiver.phone} accepted your request friends`,
          group: 0,
          read: false,
          accountId:receiverId,
          creatorId: receiverId,
        }),
      ]);
    }
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Setting accept friend successfully',
    });
  }),

  handleGetListSuggestFriends: catchAsync(async (req, res) => {
    const { index, count } = req.body;
    const { accountId } = req.data;

    // Check account
    const account = await models.accounts.findByPk(accountId, {
      attributes: ['avatarSrc', 'bgSrc'],
    });
    if (!account) {
      throw errorUtils.createError(
        404,
        9995,
        'Request failed. Because we can not find your account',
      );
    }
    // Check locked
    if (account.isBlocked) {
      throw errorUtils.createError(403, 1009, 'Your account was locked for some reasons');
    }
    let resValues;
    const getListSuggestedFriendsQuery = utils.createGetSuggestedFriendsQuery(
      accountId,
      index,
      count,
    );
    const [results] = await models.sequelize.query(getListSuggestedFriendsQuery);

    if (results.length) {
      resValues = results;
    } else {
      const [results] = await models.sequelize.query(
        `
        SELECT
          a.id as "user_id", 
          a."avatarLink" as "avatar", 
          a."name" as "username"
        FROM
          accounts a
        WHERE
          a."id" != ${accountId}
        `,
      );
      resValues = _.map(results, (acc) => ({ ...acc, same_friends: 0 }));
    }

    return res.status(200).json({
      code: 1000,
      message: 'Ok - Getting suggested friends successfully',
      data: {
        list_users: resValues,
      },
    });
  }),

  handleGetListBlocks: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { index, count } = req.body;
    const account = await models.accounts.findByPk(accountId, {
      attributes: ['id', 'isBlocked', 'isActive'],
    });
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found user');
    }
    if (!account.isActive) {
      throw errorUtils.createError(
        403,
        1004,
        'Your account does not activate. Please activate your account and try again',
      );
    }
    if (account.isBlocked) {
      throw errorUtils.createError(
        400,
        9995,
        'Your account was blocked due to violate public standard',
      );
    }
    // Get blocker
    const [blockers] = await models.sequelize.query(
      utils.createGetListBlocksQuery(accountId, index, count),
    );
    // Construct result
    const results = _.map(blockers, (u) => {
      const { name, phone, ...rest } = u;
      return {
        ...rest,
        name: name || phone,
      };
    });
    return res.status(200).json({
      code: 1000,
      message: 'Getting list blocks successfully',
      data: results,
    });
  }),

  handleChangePassword: catchAsync(async (req, res) => {
    const { accountId, phone } = req.data;
    const { password, new_password } = req.body;
    // check same password
    if (password === new_password) {
      throw errorUtils.createError(400, 1004, 'New password can not be same as old password');
    }
    // check account
    const account = await models.accounts.findByPk(+accountId);
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found user');
    }
    // check isBlocked
    if (account.isBlocked) {
      throw errorUtils.createError(
        404,
        9995,
        'Your account was blocked due to violate public standard',
      );
    }
    const isMatch = await passwordUtils.isPasswordMatch(account.password, password);
    if (!isMatch) {
      throw errorUtils.createError(403, 1004, 'The old password is incorrect');
    }
    // check same phone
    if (new_password === account.phone) {
      throw errorUtils.createError(400, 1004, 'The new password can not same as phone');
    }
    // check same percent
    if (utils.similarity(password, new_password) >= 0.8) {
      throw errorUtils.createError(
        400,
        1004,
        'The new password is too similar to the old password. Please choose another one',
      );
    }
    const newHash = await passwordUtils.hashPassword(new_password);
    await account.update({ password: newHash });
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Changing password successfully',
    });
  }),

  handleGetPushSettings: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const account = await models.accounts.findByPk(+accountId);
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found user');
    }
    if (!account.isActive) {
      throw errorUtils.createError(
        403,
        1010,
        'Your account does not activate yet. Please activate it and try again',
      );
    }
    if (account.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'The account was locked due to violate public standard or not activated',
      );
    }
    let setting = await models.settings.findOne({
      where: {
        accountId,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    if (!setting) {
      const settingPayload = utils.createSettingPayload(accountId);
      setting = await models.settings.create(settingPayload);
    }
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Getting push setting successfully',
      data: {
        like_comment: setting.likeComment,
        from_friends: setting.fromFriends,
        requested_friend: setting.requestedFriend,
        suggested_friend: setting.suggestedFriend,
        birthday: setting.birthday,
        video: setting.video,
        report: setting.report,
        sound_on: setting.soundOn,
        notification_on: setting.notificationOn,
        vibrant_on: setting.vibrantOn,
        led_on: setting.ledOn,
      },
    });
  }),

  handleSetPushSettings: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { token, ...rest } = req.body;
    const [account, setting] = await Promise.all([
      models.accounts.findByPk(+accountId),
      models.settings.findOne({
        where: {
          accountId,
        },
      }),
    ]);
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found user');
    }
    if (!setting) {
      throw errorUtils.createError(404, 9995, 'Not found setting');
    }
    if (!Object.keys(rest).length) {
      throw errorUtils.createError(400, 1003, 'Can not find some data to update');
    }
    let payload = {};
    for (const field of Object.keys(rest)) {
      const instanceField = mappingFields[field];
      const val = rest[field];
      payload[instanceField] = val;
    }
    await setting.update(payload);
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Updating push setting successfully',
    });
  }),

  handleSetBlock: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { user_id, type } = req.body;
    // check user_id
    if (accountId === +user_id) {
      throw errorUtils.createError(400, 1004, 'The user_id can not same as the current user id');
    }
    const [currentAcc, blockAcc, blocker] = await Promise.all([
      models.accounts.findByPk(+accountId),
      models.accounts.findByPk(+user_id),
      models.blockers.findOne({
        where: {
          userId: accountId,
          blockerId: +user_id,
        },
      }),
    ]);
    // check current user
    if (!currentAcc) {
      throw errorUtils.createError(404, 9995, 'Not found requested user');
    }
    if (currentAcc.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'The current user was blocked due to violate public standard',
      );
    }
    // check blocked user
    if (!blockAcc) {
      throw errorUtils.createError(404, 9995, 'Not found blocked person');
    }
    if (blockAcc.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'The blocked person was blocked due to violate public standard',
      );
    }
    // check isBlocked
    if (blocker) {
      if (blocker.type !== type) {
        await blocker.update({
          type,
        });
      }
    } else {
      await models.blockers.create({
        userId: accountId,
        blockerId: +user_id,
        type,
      });
    }

    return res.status(200).json({
      code: 1000,
      message: 'Ok - Handling set block user successfully',
    });
  }),

  getAvatar: catchAsync(async (req, res) => {
    const { user_id } = req.params;
    const account = await models.accounts.findByPk(+user_id, {
      raw: true,
      attributes: ['avatarSrc', 'avatarType'],
    });
    if (!account) {
      throw errorUtils.createError(404, 9994, 'Not found avatar');
    }
    if (!account.avatarSrc) {
      return res.status(200).sendFile(path.resolve(__dirname, '..', '..', 'assets', 'avatar.png'));
    }
    return res.header('Content-Type', account.avatarType).status(200).send(account.avatarSrc);
  }),

  getBackground: catchAsync(async (req, res) => {
    const { user_id } = req.params;
    const account = await models.accounts.findByPk(+user_id, {
      raw: true,
      attributes: ['bgSrc', 'bgType'],
    });
    if (!account) {
      throw errorUtils.createError(404, 9994, 'Not found avatar');
    }
    if (!account.bgSrc) {
      return res.status(200).sendFile(path.resolve(__dirname, '..', '..', 'assets', 'nature.png'));
    }
    return res.header('Content-Type', account.bgType).status(200).send(account.bgSrc);
  }),

  handleGetUserFriends: catchAsync(async (req, res) => {
    const { user_id, index, count } = req.body;
    const currentUserId = user_id ? +user_id : req.data.accountId;
    // Check user
    const account = await models.accounts.findByPk(+currentUserId, {
      attributes: ['id', 'isBlocked', 'isActive'],
    });
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found user');
    }
    if (!account.isActive) {
      throw errorUtils.createError(
        403,
        1004,
        'The user does not activate. Please activate it and try again',
      );
    }
    if (account.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'The user was blocked due to violate public standard',
      );
    }
    const [[result1]] = await Promise.all([
      models.sequelize.query(utils.createGetFriendsOfCurrentUserQuery(currentUserId, index, count)),
    ]);
    const listFriends = utils.constructListFriends(result1);
    return res.status(200).json({
      code: 1000,
      message: 'Handling get user friends successfully',
      data: {
        friends: listFriends,
        total: listFriends.length,
      },
    });
  }),

  handleGetUserInfo: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { user_id } = req.body;
    const userId = user_id ? +user_id : accountId;
    const account = await models.accounts.findByPk(userId, {
      attributes: [
        'id',
        'name',
        'phone',
        'desc',
        'avatarLink',
        'bgLink',
        'address',
        'city',
        'country',
        'createdAt',
        'isActive',
        'isBlocked',
      ],
      include: [
        {
          model: models.friends,
        },
        {
          model: models.blockers,
        },
      ],
    });
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found user');
    }
    if (!account.isActive) {
      throw errorUtils.createError(
        403,
        1010,
        'Your account does not activate. Please activate it and try again',
      );
    }
    if (account.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'Your account was locked due to violate public standard',
      );
    }
    const data = account.toJSON();
    if (utils.isBlock(data.blockers, accountId)) {
      return res.status(200).json({
        code: 1000,
        message: 'Ok - Getting user info successfully',
        data: {
          is_block: true,
          message: 'User is not exist. Please try it later',
        },
      });
    }
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Getting user info successfully',
      data: utils.constructGetUserInfo(account.toJSON(), accountId),
    });
  }),

  handleSetUserInfo: catchAsync(async (req, res) => {
    const { token, ...payload } = req.body;
    const { accountId } = req.data;
    const account = await models.accounts.findByPk(accountId, {
      attributes: {
        exclude: ['avatarSrc', 'bgSrc'],
      },
    });
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found user');
    }
    if (!account.isActive) {
      throw errorUtils.createError(
        403,
        1004,
        'The account does not activate. Please activate it and try again',
      );
    }
    if (account.isBlocked) {
      throw errorUtils.createError(
        403,
        9995,
        'The account was blocked due to violate public standard',
      );
    }
    if (!Object.keys(payload).length) {
      throw errorUtils.createError(400, 1003, 'No data provided');
    }
    for (const field of Object.keys(payload)) {
      const val = payload[field];
      if (field === 'avatar') {
        account.set({
          avatarSrc: val.buffer,
          avatarType: val.mimetype,
          avatarLink: `${process.env.BASE_URL_AVATAR}/${account.id}`,
        });
      } else if (field === 'cover_image') {
        account.set({
          bgSrc: val.buffer,
          bgType: val.mimetype,
          bgLink: `${process.env.BASE_URL_BACKGROUND}/${account.id}`,
        });
      } else {
        const mappingField = updateMappingFields[field];
        account.set({
          [mappingField]: val,
        });
      }
    }
    await account.save();
    await account.reload();
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Handling set user info successfully',
      data: {
        avatar: account.avatarLink,
        cover_image: account.bgLink,
        link: account.link,
        city: account.city,
        country: account.country,
        address: account.address,
      },
    });
  }),

  handleSetDevToken: catchAsync(async (req, res) => {
    const { accountId } = req.data;
    const { devtype, devtoken } = req.body;
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
        'The account was blocked due to violate public standard',
      );
    }
    await account.update({
      uuid: devtoken,
      devType: devtype,
    });
    await account.reload();
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Handling set devtoken successfully',
      data: {
        devtoken: account.uuid,
        devtype: account.devType,
      },
    });
  }),
};
