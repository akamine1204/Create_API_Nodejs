'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('messages', 'sender');
  },

  async down(queryInterface, Sequelize) {},
};
