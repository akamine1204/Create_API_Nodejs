'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await Promise.all([
      queryInterface.addColumn('accounts', 'verifyCode', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('accounts', 'codeExpireIn', {
        type: Sequelize.STRING,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await Promise.all([
      queryInterface.removeColumn('accounts', 'verifyCode'),
      queryInterface.removeColumn('accounts', 'codeExpireIn'),
    ]);
  },
};