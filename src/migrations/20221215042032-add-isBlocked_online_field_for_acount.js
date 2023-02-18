'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('accounts', 'isBlocked', {
        type: Sequelize.BOOLEAN,
      }),
      queryInterface.addColumn('accounts', 'isOnline', {
        type: Sequelize.BOOLEAN,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('accounts', 'isOnline'),
      queryInterface.removeColumn('accounts', 'isBlocked'),
    ]);
  },
};
