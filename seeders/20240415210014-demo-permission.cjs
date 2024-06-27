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

    await queryInterface.bulkInsert('Permissions', [
      {
        roleId: 1,
        routeId: 1,
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1,
        routeId: 2,
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1,
        routeId: 3,
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        routeId: 1,
        actions: 'CRU',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        routeId: 2,
        actions: 'CRU',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2,
        routeId: 3,
        actions: 'CRU',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3,
        routeId: 1,
        actions: 'CR',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
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
