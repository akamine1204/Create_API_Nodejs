'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      accountId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'accounts',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      likeComment: {
        type: Sequelize.STRING,
        defaultValue: '1',
      },
      fromFriends: {
        type: Sequelize.STRING,
        defaultValue: '1',
      },
      requestedFriend: {
        type: Sequelize.STRING,
        defaultValue: '1',
      },
      suggestedFriend: {
        type: Sequelize.STRING,
        defaultValue: '1',
      },
      birthday: {
        type: Sequelize.STRING,
        defaultValue: '1',
      },
      video: {
        type: Sequelize.STRING,
        defaultValue: '1',
      },
      report: {
        type: Sequelize.STRING,
        defaultValue: '1',
      },
      soundOn: {
        type: Sequelize.STRING,
        defaultValue: '1',
      },
      notificationOn: {
        type: Sequelize.STRING,
        defaultValue: '1',
      },
      vibrantOn: {
        type: Sequelize.STRING,
        defaultValue: '1',
      },
      ledOn: {
        type: Sequelize.STRING,
        defaultValue: '1',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('settings');
  },
};
