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
    await queryInterface.bulkInsert('Departments', [
      {
        name: 'Ahuachapán',
        codeMH: '01',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Santa Ana',
        codeMH: '02',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sonsonate',
        codeMH: '03',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Chalatenango',
        codeMH: '04',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'La Libertad',
        codeMH: '05',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'San Salvador',
        codeMH: '06',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cuscatlán',
        codeMH: '07',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'La Paz',
        codeMH: '08',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cabañas',
        codeMH: '09',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'San Vicente',
        codeMH: '10',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Usulután',
        codeMH: '11',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'San Miguel',
        codeMH: '12',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Morazán',
        codeMH: '13',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'La Unión',
        codeMH: '14',
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
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
