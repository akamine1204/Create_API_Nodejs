'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('postVideos', 'thumbnailSrc', {
        type: Sequelize.BLOB,
      }),
      queryInterface.addColumn('postVideos', 'thumbnailType', {
        type: Sequelize.STRING,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('postVideos', 'thumbnailSrc'),
      queryInterface.removeColumn('postVideos', 'thumbnailType'),
    ]);
  },
};
