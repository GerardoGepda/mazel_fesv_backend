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
        name: 'Menús',
        path: 'settings/menu-management',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Documentos',
        path: 'documents',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Clientes',
        path: 'customers',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Facturas y CCF',
        path: 'fc_ccf',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sujetos Excluidos',
        path: 'se',
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
