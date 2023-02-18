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
      queryInterface.addColumn('posts', 'isCanComment', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      }),
      queryInterface.addColumn('posts', 'isCanEdit', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      }),
      queryInterface.addColumn('posts', 'isBanned', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
      queryInterface.removeColumn('posts', 'isCanComment'),
      queryInterface.removeColumn('posts', 'isCanEdit'),
      queryInterface.removeColumn('posts', 'isBanned'),
    ]);
  },
};
