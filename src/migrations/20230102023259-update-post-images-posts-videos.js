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
      queryInterface.addConstraint('postImages', {
        type: 'FOREIGN KEY',
        fields: ['postId'],
        name: 'fk_postId_postImages_posts',
        references: {
          table: 'posts',
          field: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
      queryInterface.addConstraint('postVideos', {
        type: 'FOREIGN KEY',
        fields: ['postId'],
        name: 'fk_postId_postVideos_posts',
        references: {
          table: 'posts',
          field: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
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
      queryInterface.removeConstraint('postImages', 'fk_postId_postImages_posts'),
      queryInterface.removeConstraint('postVideos', 'fk_postId_postVideos_posts'),
    ]);
  },
};
