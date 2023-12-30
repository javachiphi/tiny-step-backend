'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("entry_tags", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      entry_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "entries",
          key: "id",
        },
      },
      tag_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "tags",
          key: "id",
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  async down (queryInterface) {
    await queryInterface.dropTable("entry_tags");
  }
};
