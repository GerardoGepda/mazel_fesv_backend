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
    await queryInterface.bulkInsert('MenuRoutes', [
      {
        state: 1,
        menuId: 1,
        submenuId: null,
        routeId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 1,
        menuId: 2,
        submenuId: 1,
        routeId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 1,
        menuId: 2,
        submenuId: 2,
        routeId: 3,
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
