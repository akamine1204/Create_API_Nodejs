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
      queryInterface.addColumn('accounts', 'avatarSrc', {
        type: Sequelize.BLOB,
      }),
      queryInterface.addColumn('accounts', 'bgLink', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('accounts', 'bgSrc', {
        type: Sequelize.BLOB,
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
      queryInterface.removeColumn('accounts', 'bgSrc'),
      queryInterface.removeColumn('accounts', 'bgLink'),
      queryInterface.removeColumn('accounts', 'avatarSrc'),
    ]);
  },
};
