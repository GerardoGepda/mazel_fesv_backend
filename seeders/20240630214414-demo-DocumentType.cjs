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
    await queryInterface.bulkInsert('DocumentTypes', [
      {
        name: 'NIT',
        codeMH: '36',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'DUI',
        codeMH: '13',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Otro',
        codeMH: '37',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pasaporte',
        codeMH: '03',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Carnet de Residente',
        codeMH: '02',
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
