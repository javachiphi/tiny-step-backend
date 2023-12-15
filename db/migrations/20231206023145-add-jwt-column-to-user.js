'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'jwt_sub', { type: Sequelize.STRING });
    await queryInterface.removeColumn('users', 'password');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'password', { type: Sequelize.STRING });
    await queryInterface.removeColumn('users', 'jwt_sub');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
