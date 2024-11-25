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
        roleId: 1, // admin
        routeId: 1, // menu management
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1, // admin
        routeId: 2, // documents
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1, // admin
        routeId: 3, // customers
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1, // admin
        routeId: 4, // FC, CCF
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 1, // admin
        routeId: 5, // SE
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // gerente
        routeId: 2, // documents
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // gerente
        routeId: 3, // customers
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // gerente
        routeId: 4, // FC, CCF
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 2, // gerente
        routeId: 5, // SE
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3, // empleado
        routeId: 2, // documents
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3, // empleado
        routeId: 3, // customers
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3, // empleado
        routeId: 4, // FC, CCF
        actions: 'CRUD',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        roleId: 3, // empleado
        routeId: 5, // SE
        actions: 'CRUD',
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
