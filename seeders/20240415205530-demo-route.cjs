'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Routes', [
      {
        name: 'Home',
        path: 'home',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Menús',
        path: 'settings/menu-management',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'App setting',
        path: 'app-setting',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
