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
        menuId: 1, // Configuraciones
        submenuId: 1, // Menus
        routeId: 1, // menu management
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 1,
        menuId: 2, // Clientes
        submenuId: null,
        routeId: 2, // Clientes
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 1,
        menuId: 3, // FC, CCF
        submenuId: null,
        routeId: 3, // FC, CCF
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        state: 1,
        menuId: 4, // SE
        submenuId: 1,
        routeId: 4, // SE
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
