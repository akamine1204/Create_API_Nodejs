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
      queryInterface.addColumn('accounts', 'desc', {
        type: Sequelize.TEXT,
      }),
      queryInterface.addColumn('accounts', 'link', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('accounts', 'address', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('accounts', 'city', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('accounts', 'country', {
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
      queryInterface.removeColumn('accounts', 'desc'),
      queryInterface.removeColumn('accounts', 'link'),
      queryInterface.removeColumn('accounts', 'address'),
      queryInterface.removeColumn('accounts', 'city'),
      queryInterface.removeColumn('accounts', 'country'),
    ]);
  },
};
