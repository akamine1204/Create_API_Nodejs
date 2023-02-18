const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const models = require('./../../models');

const {
  jwtUtils,
  dateUtils,
  catchAsync,
  errorUtils,
  helperUtils,
  passwordUtils,
  templateUtils,
  mailUtils,
} = require('./../../utils');

module.exports = {
  handleSignUp: catchAsync(async (req, res) => {
    const { phonenumber, password: pass, uuid, email } = req.body;
    const [checkPhone, checkEmail] = await Promise.all([
      models.accounts.findOne({
        raw: true,
        attributes: {
          exclude: ['avatarSrc', 'bgSrc'],
        },
        where: {
          phone: phonenumber,
        },
      }),
      models.accounts.findOne({
        raw: true,
        attributes: {
          exclude: ['avatarSrc', 'bgSrc'],
        },
        where: {
          email: {
            [Op.iLike]: email,
          },
        },
      }),
    ]);
    // Check phone
    if (!!checkPhone) {
      throw errorUtils.createError(
        400,
        9996,
        'Phone number already in use. Please choose another one',
      );
    }
    // Check email
    if (!!checkEmail) {
      throw errorUtils.createError(400, 9996, 'Email already in use. Please choose another one');
    }
    // Hashing password
    const hash = await passwordUtils.hashPassword(pass);
    const code = helperUtils.createVerifyCode();
    const expireIn = dateUtils.createExpireTime(); // 2 minutes
    // Inserting data into table
    await models.accounts.create({
      uuid,
      email,
      password: hash,
      phone: phonenumber,
      uuid: uuid || uuidv4(),
      verifyCode: `${code}`,
      codeExpireIn: `${expireIn}`,
    });
    // Sending mail
    const template = templateUtils.createVerifyCodeTemplate(code);
    await mailUtils.sendMail(email, '[DAMN-Facebook] Your verification code', template);
    // Return response
    return res.status(201).json({
      code: 1000,
      message: 'OK - Sign up successfully. Please check your mail to receive verification code',
      data: null,
    });
  }),

  handleLogin: catchAsync(async (req, res) => {
    const { phonenumber, password: pass, uuid } = req.body;
    if (pass === phonenumber) {
      throw errorUtils.createError(
        400,
        1004,
        'The password should not be same as the phone number',
      );
    }
    // Find account
    const account = await models.accounts.findOne({
      attributes: {
        exclude: ['avatarSrc', 'bgSrc'],
      },
      where: {
        phone: phonenumber,
      },
    });
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Incorrect phone number or password');
    }
    // Check password
    const { password, createdAt, updatedAt, ...rest } = account.toJSON();
    const isMatch = await passwordUtils.isPasswordMatch(password, pass);
    if (!isMatch) {
      throw errorUtils.createError(403, 9995, 'Incorrect phone number or password');
    }
    // Create token
    const token = jwtUtils.createAccessToken({
      accountId: rest.id,
      phone: rest.phone,
    });
    // Update token
    account.set({ token });
    // Update device id
    if (account.deviceId !== uuid) {
      account.set({ deviceId: uuid });
    }
    // Update record
    account.save();
    // Return response
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Login successfully',
      data: {
        token,
        id: rest.id,
        phone: rest.phone,
        username: rest.name,
        avatar: rest.avatarLink,
      },
    });
  }),

  handleLogout: catchAsync(async (req, res) => {
    const { token } = req.body;
    // Check account
    const account = await models.accounts.findOne({
      where: { token },
    });
    if (!account) {
      throw errorUtils.createError(404, 9998, 'Logout failed. Maybe user was offline');
    }
    // Remove token
    await account.update({ token: null });
    // Return response
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Logout successfully',
    });
  }),

  handleGetVerifyCode: catchAsync(async (req, res) => {
    const { phonenumber } = req.body;
    const account = await models.accounts.findOne({
      attributes: {
        exclude: ['avatarSrc', 'bgSrc'],
      },
      where: {
        phone: phonenumber,
      },
    });
    // Find account
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found user');
    }
    // Check activated user
    if (account.isActive) {
      throw errorUtils.createError(
        403,
        1010,
        'Can not resolve your request because your account was activated',
      );
    }
    //!! Extract verifyCode, codeExpireIn
    const currentTime = dateUtils.getCurrentTime();
    const { verifyCode, codeExpireIn } = account.toJSON();
    let code = +verifyCode;
    if ((!verifyCode && !codeExpireIn) || +codeExpireIn - currentTime <= 0) {
      code = helperUtils.createVerifyCode();
      const time = dateUtils.createExpireTime();
      await account.update({
        verifyCode: `${code}`,
        codeExpireIn: `${time}`,
      });
    }
    // Sending mail
    await mailUtils.sendMail(
      account.email,
      '[DAMN-Facebook] Resend verification code',
      templateUtils.createVerifyCodeTemplate(code),
    );
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Getting verification code successfully. Please check your mail',
    });
  }),

  handleCheckVerifyCode: catchAsync(async (req, res) => {
    const { phonenumber, code_verify } = req.body;
    // Find user
    const account = await models.accounts.findOne({
      attributes: {
        exclude: ['avatarSrc', 'bgSrc'],
      },
      where: {
        phone: phonenumber,
      },
    });
    // Check account
    if (!account) {
      throw errorUtils.createError(404, 9995, 'Not found user');
    }
    // Check activated user
    if (account.isActive) {
      throw errorUtils.createError(
        403,
        1004,
        'Can not resolve your request because your account was activated',
      );
    }
    // Extract data
    const { phone, verifyCode, codeExpireIn, id } = account.toJSON();
    const currentTime = dateUtils.getCurrentTime();
    if (+verifyCode !== +code_verify || +codeExpireIn - currentTime <= 0) {
      throw errorUtils.createError(
        403,
        1004,
        'The verification code is incorrect or out of expiration',
      );
    }
    // Update token
    const token = jwtUtils.createAccessToken({
      accountId: id,
      phone,
    });
    // Update record
    await Promise.all([
      account.update({
        token,
        verifyCode: null,
        codeExpireIn: null,
        isActive: true,
      }),
      models.settings.create({
        accountId: account.id,
        like_comment: 1,
        from_friends: 1,
        requested_friend: 1,
        suggested_friend: 1,
        birthday: 1,
        video: 1,
        report: 1,
        sound_on: 1,
        notification_on: 1,
        vibrant_on: 1,
        led_on: 1,
      }),
    ]);
    // Send response
    return res.status(200).json({
      code: 1000,
      message: 'Ok - Checking verification code successfully. Your account was activated',
      data: {
        id,
        token,
      },
    });
  }),
};
