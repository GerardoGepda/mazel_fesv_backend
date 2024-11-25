'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Menus', [
      {
        name: 'Configuraciones',
        state: 1,
        order: 1,
        icon: 'tune',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Documentos',
        state: 1,
        order: 2,
        icon: 'description',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Clientes',
        state: 1,
        order: 3,
        icon: 'people',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Facturas y CCF',
        state: 1,
        order: 4,
        icon: 'receipt_long',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sujetos Excluidos',
        state: 1,
        order: 5,
        icon: 'article',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
