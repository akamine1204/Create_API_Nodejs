const ValidationType = {
  Trim: 'Trim',
  NotEmpty: 'notEmpty',
  Existed: 'existed',
  IsInt: 'isInt',
  IsLength: 'isLength',
  Optional: 'optional',
  IsJWT: 'isJWT',
  Matches: 'matches',
  ToInt: 'toInt',
  IsIn: 'isIn',
  IsEmail: 'isEmail',
  IsUrl: 'isURL',
  IsUUID: 'isUUID',
  IsArray: 'isArray',
  IsNumeric: 'isNumeric',
  ToFloat: 'toFloat',
  Not: 'not',
};

const body = {
  count: {
    name: 'count',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No count provided',
      },
      {
        type: ValidationType.NotEmpty,
        message: 'No count provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The count value does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The count value is invalid. It should be a positive integer',
        min: 0,
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
  index: {
    name: 'index',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No index provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The index value does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The index value is invalid. It should be a positive integer',
        min: 0,
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
  token: {
    name: 'token',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No token provided',
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The token does not empty',
      },
      {
        type: ValidationType.IsJWT,
        message: 'Invalid token',
      },
    ],
  },
  phone: {
    name: 'phonenumber',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No phone number provided',
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The token does not empty',
      },
      {
        type: ValidationType.Matches,
        pattern: /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/g,
        message: 'The phone number is not a Vietnamese phone number',
      },
    ],
  },
  password: {
    name: 'password',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No password provided',
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The password does not empty',
      },
      {
        type: ValidationType.Matches,
        message:
          'Invalid format password. The password should be have from 6 to 20 characters without special characters',
        pattern: /^[a-zA-Z0-9]{6,20}$/,
      },
    ],
  },
  verifyCode: {
    name: 'code_verify',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No verification code provided',
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The verification code does not empty',
      },
      {
        type: ValidationType.Matches,
        message: 'The code verify is invalid',
        pattern: /^[0-9]{6}$/,
      },
    ],
  },
  newPassword: {
    name: 'new_password',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No new password provided',
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The new password does not empty',
      },
      {
        type: ValidationType.Matches,
        message:
          'Invalid format password. The password should be have from 6 to 20 characters without special characters',
        pattern: /^[a-zA-Z0-9]{6,20}$/,
      },
    ],
  },
  isAccept: {
    name: 'is_accept',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'Please provide your decision: Agree-1/Decline-0',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The decision does not empty',
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['0', '1'],
        message: 'The decision is invalid: Agree-1 | Decline-0',
      },
    ],
  },
  email: {
    name: 'email',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No email provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The email does not empty',
      },
      {
        type: ValidationType.IsEmail,
        message: 'The email is invalid',
      },
    ],
  },
  username: {
    name: 'username',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No username provided',
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The username does not empty',
      },
      {
        type: ValidationType.Matches,
        message:
          'Invalid username. The username contains (a-z, 0-9) without special characters, spacing',
        pattern: /[a-zA-Z0-9]+$/,
      },
      {
        type: ValidationType.IsUrl,
        isNot: true,
        message: 'Invalid username. The username can not be a URL',
      },
      {
        type: ValidationType.IsLength,
        message: 'Invalid username. The username contains from 3 to 50 characters',
        min: 3,
        max: 50,
      },
    ],
  },
  usernameOptional: {
    name: 'username',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The username does not empty',
      },
      {
        type: ValidationType.Matches,
        message:
          'Invalid username. The username contains (a-z, 0-9) without special characters, spacing',
        pattern: /[a-zA-Z0-9]+$/,
      },
      {
        type: ValidationType.IsUrl,
        isNot: true,
        message: 'Invalid username. The username can not be a URL',
      },
      {
        type: ValidationType.IsLength,
        message: 'Invalid username. The username contains from 3 to 50 characters',
        min: 3,
        max: 50,
      },
    ],
  },
  userId: {
    name: 'user_id',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No user id provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The user id does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The user id invalid. It should be a positive integer',
        min: 1,
      },
    ],
  },
  userIdOptional: {
    name: 'user_id',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The user id does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The user id invalid. It should be a positive integer',
        min: 1,
      },
    ],
  },
  likeComment: {
    name: 'like_comment',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The like_comment setting does not empty',
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['0', '1'],
        message: 'The like_comment is not valid (1 or 0)',
      },
    ],
  },
  fromFriends: {
    name: 'from_friends',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The from_friends setting does not empty',
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['0', '1'],
        message: 'The from_friends is not valid (1 or 0)',
      },
    ],
  },
  requestedFriend: {
    name: 'requested_friend',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The requested_friend does not empty',
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['0', '1'],
        message: 'The requested_friend value is not valid (1 or 0)',
      },
    ],
  },
  suggestedFriend: {
    name: 'suggested_friend',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The suggested_friend does not empty',
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['0', '1'],
        message: 'The suggested_friend value is not valid (1 or 0)',
      },
    ],
  },
  birthday: {
    name: 'birthday',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The birthday does not empty',
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['0', '1'],
        message: 'The birthday value is not valid (1 or 0)',
      },
    ],
  },
  video: {
    name: 'video',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The video does not empty',
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['0', '1'],
        message: 'The video value is not valid (1 or 0)',
      },
    ],
  },
  report: {
    name: 'report',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The report does not empty',
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['0', '1'],
        message: 'The report value is not valid (1 or 0)',
      },
    ],
  },
  soundOn: {
    name: 'sound_on',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The sound_on does not empty',
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['0', '1'],
        message: 'The sound_on value is not valid (1 or 0)',
      },
    ],
  },
  notificationOn: {
    name: 'notification_on',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The notification_on does not empty',
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['0', '1'],
        message: 'The notification_on value is not valid (1 or 0)',
      },
    ],
  },
  vibrantOn: {
    name: 'vibrant_on',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The vibrant_on does not empty',
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['0', '1'],
        message: 'The vibrant_on value is not valid (1 or 0)',
      },
    ],
  },
  ledOn: {
    name: 'led_on',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The led_on does not empty',
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['0', '1'],
        message: 'The led_on value is not valid (1 or 0)',
      },
    ],
  },
  blockType: {
    name: 'type',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'The block type does not exist',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The block type does not empty',
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['block', 'unblock'],
        message: 'The block type is invalid (block | unblock)',
      },
    ],
  },
  described: {
    name: 'described',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The description of post does not empty',
      },
      {
        type: ValidationType.IsLength,
        message: 'The description contains from 2 to 1000 characters',
        min: 2,
        max: 1000,
      },
    ],
  },
  uuid: {
    name: 'uuid',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No device id provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The device id does not empty',
      },
      {
        type: ValidationType.IsUUID,
        message: 'The device id is invalid. It should be a uuid string',
      },
    ],
  },
  status: {
    name: 'status',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The status does not empty',
      },
      {
        type: ValidationType.IsIn,
        message: 'The status is invalid',
        isInOptions: [
          'happy',
          'loved',
          'lovely',
          'excited',
          'crazy',
          'blissful',
          'silly',
          'wonderful',
          'amused',
          'hopeful',
          'tired',
          'proud',
          'thoughtful',
          'nostalgic',
          'sick',
          'drained',
          'confident',
          'exhausted',
          'heartbroken',
          'sleepy',
          'hungry',
          'pained',
          'disappointed',
          'cold',
          'fabulous',
          'sorry',
          'worried',
          'bad',
          'inspired',
          'satisfied',
          'down',
          'funny',
          'super',
          'great',
          'cute',
          'optimistic',
          'peaceful',
          'professional',
          'energized',
          'bored',
          'lucky',
          'annoyed',
          'determined',
          'awesome',
          'emotional',
          'delighted',
          'angry',
          'ok',
          'alone',
          'motivated',
          'joyful',
          'chill',
          'relaxed',
          'cool',
          'festive',
          'fantastic',
          'blessed',
          'sad',
          'thankful',
          'in love',
          'grateful',
          'festive',
        ],
      },
    ],
  },
  postId: {
    name: 'id',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No post id provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The post id does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The post id is invalid. It should be a positive integer',
        min: 1,
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
  imageDel: {
    name: 'image_del',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.IsArray,
        message: 'The image_del is invalid',
      },
    ],
  },
  imageSort: {
    name: 'image_sort',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.IsArray,
        message: 'The image_sort is invalid',
      },
    ],
  },
  autoAccept: {
    name: 'auto_accept',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['0', '1'],
        message: 'The auto_accept value is invalid. It should be 1 or 0',
      },
    ],
  },
  autoBlock: {
    name: 'auto_block',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['0', '1'],
        message: 'The auto_block value is invalid. It should be 1 or 0',
      },
    ],
  },
  subject: {
    name: 'subject',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No subject provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The subject does not empty',
      },
    ],
  },
  details: {
    name: 'details',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No details provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The details do not empty',
      },
    ],
  },
  comment: {
    name: 'comment',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No comment content provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The comment content does not empty',
      },
    ],
  },
  campaignId: {
    name: 'campaign_id',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The campaign_id does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The campaign_id is invalid. It should be a positive integer',
        min: 1,
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
  inCampaign: {
    name: 'in_campaign',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The in_campaign does not empty',
      },
      {
        type: ValidationType.IsIn,
        message: 'The in_campaign is invalid. It should be equal 1 or 0',
        isInOptions: ['0', '1'],
      },
    ],
  },
  latitude: {
    name: 'latitude',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The latitude does not empty',
      },
      {
        type: ValidationType.IsNumeric,
        message: 'The latitude is invalid. It should be a numeric',
      },
      {
        type: ValidationType.ToFloat,
      },
    ],
  },
  longitude: {
    name: 'longitude',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The longitude does not empty',
      },
      {
        type: ValidationType.IsNumeric,
        message: 'The longitude is invalid. It should be a numeric',
      },
      {
        type: ValidationType.ToFloat,
      },
    ],
  },
  lastId: {
    name: 'last_id',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The last_id does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The last_id is invalid. It should be a positive integer',
        min: 0,
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
  lastIdRequired: {
    name: 'last_id',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No last_id provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The last_id does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The last_id is invalid. It should be a positive integer',
        min: 0,
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
  categoryId: {
    name: 'category_id',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The category_id does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The category_id is invalid. It should be a positive integer',
        min: 0,
      },
      {
        type: ValidationType.IsIn,
        message: 'The category_id is invalid. It only accepts value from 0 to 3',
        isInOptions: ['0', '1', '2', '3'],
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
  searchId: {
    name: 'search_id',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The search_id does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The search_id is invalid. It should be a positive integer',
        min: 0,
      },
    ],
  },
  all: {
    name: 'all',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The all param does not empty',
      },
      {
        type: ValidationType.IsIn,
        message: 'The all param is invalid. It only accepts value 0 or 1',
        isInOptions: ['0', '1'],
      },
    ],
  },
  description: {
    name: 'description',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The description does not empty',
      },
      {
        type: ValidationType.IsLength,
        max: 150,
        message: 'The description can not contain over 150 characters',
      },
    ],
  },
  address: {
    name: 'address',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The address does not empty',
      },
    ],
  },
  city: {
    name: 'city',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The city does not empty',
      },
    ],
  },
  country: {
    name: 'country',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The city does not empty',
      },
    ],
  },
  link: {
    name: 'link',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The link does not empty',
      },
      {
        type: ValidationType.IsUrl,
        message: 'The link is not a url',
      },
    ],
  },
  notification_id: {
    name: 'notification_id',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No notification_id provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The notification_id does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The notification_id is invalid',
        min: 0,
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
  devType: {
    name: 'devtype',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No devtype provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The devtype does not empty',
      },
      {
        type: ValidationType.IsIn,
        isInOptions: ['ios', 'android'],
        message: 'The devtype is invalid. It should be ios or android value',
      },
    ],
  },
  devToken: {
    name: 'devtoken',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No devtoken provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The devtoken does not empty',
      },
      {
        type: ValidationType.IsUUID,
        message: 'The devtoken is invalid. It should be a UUID string',
      },
    ],
  },
  message: {
    name: 'message',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No message provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The message does not empty',
      },
      {
        type: ValidationType.IsLength,
        min: 1,
        max: 500,
        message: 'The message only contains from 1 to 500 letters',
      },
    ],
  },
  receiverId: {
    name: 'receiver_id',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No receiver_id provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The receiver_id does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The receiver_id is invalid',
        min: 0,
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
  partnerId: {
    name: 'partner_id',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The partner_id does not empty',
      },
      {
        type: ValidationType.IsInt,
        min: 1,
        message: 'The partner_id is invalid. It should be greater than 0',
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
  conversationId: {
    name: 'conversation_id',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Optional,
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The conversation_id does not empty',
      },
      {
        type: ValidationType.IsInt,
        min: 1,
        message: 'The conversation_id is invalid. It should be greater than 1',
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
  messageId: {
    name: 'message_id',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No message_id provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The message_id does not empty',
      },
      {
        type: ValidationType.IsInt,
        min: 1,
        message: 'The message_id is invalid. It should be greater than 1',
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
  keyword: {
    name: 'keyword',
    where: 'body',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No keyword provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The keyword does not empty',
      },
      {
        type: ValidationType.IsLength,
        max: 255,
        message: 'The keyword is not valid. It only contains maximum 255 letters',
      },
    ],
  },
};

const param = {
  imgId: {
    name: 'imgId',
    where: 'param',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'Please img id to continue',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The img id does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The img id is invalid. It should be a positive integer',
        min: 1,
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
  userId: {
    name: 'user_id',
    where: 'param',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'No user_id provided',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The user_id does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The user_id is invalid. It should be a positive integer',
        min: 0,
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
  videoId: {
    name: 'videoId',
    where: 'param',
    checkList: [
      {
        type: ValidationType.Existed,
        message: 'Please video id to continue',
      },
      {
        type: ValidationType.Trim,
      },
      {
        type: ValidationType.NotEmpty,
        message: 'The video id does not empty',
      },
      {
        type: ValidationType.IsInt,
        message: 'The video id is invalid. It should be a positive integer',
        min: 1,
      },
      {
        type: ValidationType.ToInt,
      },
    ],
  },
};

module.exports = {
  body,
  param,
};
