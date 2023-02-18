'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('notifications', 'creatorAvatarLink');
  },

  async down(queryInterface, Sequelize) {},
};
