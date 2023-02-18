module.exports = {
  ERROR_AUTH_PASS_INCORRECT_FORMAT:
    'Password is incorrect format. It only has from 6 t0 10 characters without special character',
  ERROR_AUTH_PASSWORD_NOT_FILL: 'Please fill your password',
  ERROR_AUTH_PHONE_NUMBER_NOT_FILL: 'Please fill your phone',
  ERROR_AUTH_PHONE_INCORRECT_FORMAT: 'The phone is invalid',
  ERROR_AUTH_NOT_FOUND_ACCOUNT: 'Your account does not exist',
  ERROR_AUTH_PASS_SAME_PHONE: 'The password can not same as phone number',
  ERROR_AUTH_PASS_INCORRECT: 'The password is incorrect.',
  ERROR_AUTH_ACC_NOT_EXISTED: 'Phone number or password is incorrect',
  ERROR_AUTH_TOKEN_NOT_EXISTED:
    'Can not find your token. Maybe you are not log in or using old token or not provide your token. Please try to login again',
  ERROR_AUTH_TOKEN_INVALID: 'The token is invalid',
  ERROR_AUTH_NOT_FOUND_VERIFY_CODE: 'Not found your verify code',
  ERROR_AUTH_USER_WAS_LOGGED_IN: 'You was logged in',
  ERROR_AUTH_EMPTY_VERIFY_CODE: 'The verify code does not empty',

  ERROR_USER_EMPTY_USERNAME: 'The username does not empty',
  ERROR_USER_INVALID_USERNAME: 'The username is invalid',
  ERROR_USER_LENGTH_OF_USERNAME:
    'Invalid. The username only has from 3 to 50 character without special character and not same as phone',
  ERROR_USER_INVALID_IMAGE_URL: 'The avatar link is invalid',
  ERROR_USER_EMPTY_AVATAR: 'The avatar link does not empty',
  ERROR_USER_NOT_EXIST: 'The user does not existed',
  ERROR_USER_VIOLATE_STANDARD:
    'Error: You tried to update your username to same as phone more 2 times. This is not allow. Your account is blocked. Please do below step to continue',
  ERROR_USER_USERNAME_SAME_PHONE:
    'The username should not be same as phone. Please choose an another one',
  ERROR_USER_ACCOUNT_BLOCKED: 'Your account currently is blocked. Please unblock it and try again',

  ERROR_POST_EMPTY_IMAGES: 'A post should have some images',
  ERROR_POST_INVALID_IMAGES: 'The image parameter is invalid',
  ERROR_POST_EMPTY_VIDEOS: 'A post should have some videos',
  ERROR_POST_INVALID_VIDEOS: 'The video parameter is invalid',
  ERROR_POST_EMPTY_DESC: 'A post must have description',
  ERROR_POST_EMPTY_STATUS: 'A post should an initial status',
  ERROR_POST_NO_MEDIA_PROVIDED: 'A post have to some images or videos',
  ERROR_POST_INVALID_TOKEN: 'Your token is invalid. Please log in and try again',
  ERROR_POST_LENGTH_OF_DESC:
    'Your description does not valid. It only hash from 2 to 1000 characters',
  ERROR_POST_INVALID_IMAGE_URL: 'The image url is invalid',
  ERROR_POST_INVALID_VIDEO_URL: 'The video url is invalid',
  ERROR_POST_POST_ID_NOT_EXIST: 'The post id does not exist',
  ERROR_POST_POST_ID_INVALID: 'The post id is invalid',
  ERROR_POST_POST_LOCKED: 'The post was locked due to violate public standard',
};
