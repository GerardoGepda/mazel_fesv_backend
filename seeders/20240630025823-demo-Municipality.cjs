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
    await queryInterface.bulkInsert('Municipalities', [
      { name: 'Ahuachapán Norte', codeMH: '13', departmentId: 1, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ahuachapán Centro', codeMH: '14', departmentId: 1, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ahuachapán Sur', codeMH: '15', departmentId: 1, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Santa Ana Norte', codeMH: '14', departmentId: 2, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Santa Ana Centro', codeMH: '15', departmentId: 2, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Santa Ana Este', codeMH: '16', departmentId: 2, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Santa Ana Oeste', codeMH: '17', departmentId: 2, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sonsonate Norte', codeMH: '17', departmentId: 3, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sonsonate Centro', codeMH: '18', departmentId: 3, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sonsonate Este', codeMH: '19', departmentId: 3, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sonsonate Oeste', codeMH: '20', departmentId: 3, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Chalatenango Norte', codeMH: '34', departmentId: 4, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Chalatenango Centro', codeMH: '35', departmentId: 4, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Chalatenango Sur', codeMH: '36', departmentId: 4, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'La Libertad Norte', codeMH: '23', departmentId: 5, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'La Libertad Centro', codeMH: '24', departmentId: 5, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'La Libertad Oeste', codeMH: '25', departmentId: 5, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'La Libertad Este', codeMH: '26', departmentId: 5, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'La Libertad Costa', codeMH: '27', departmentId: 5, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'La Libertad Sur', codeMH: '28', departmentId: 5, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'San Salvador Norte', codeMH: '20', departmentId: 6, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'San Salvador Oeste', codeMH: '21', departmentId: 6, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'San Salvador Este', codeMH: '22', departmentId: 6, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'San Salvador Centro', codeMH: '23', departmentId: 6, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'San Salvador Sur', codeMH: '24', departmentId: 6, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cuscatlan Norte', codeMH: '17', departmentId: 7, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cuscatlan Sur', codeMH: '18', departmentId: 7, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'La Paz Oeste', codeMH: '23', departmentId: 8, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'La Paz Centro', codeMH: '24', departmentId: 8, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'La Paz Este', codeMH: '25', departmentId: 8, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cabañas Oeste', codeMH: '10', departmentId: 9, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Cabañas Este', codeMH: '11', departmentId: 9, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'San Vicente Norte', codeMH: '14', departmentId: 10, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'San Vicente Sur', codeMH: '15', departmentId: 10, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Usulután Norte', codeMH: '24', departmentId: 11, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Usulután Este', codeMH: '25', departmentId: 11, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Usulután Oeste', codeMH: '26', departmentId: 11, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'San Miguel Norte', codeMH: '21', departmentId: 12, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'San Miguel Centro', codeMH: '22', departmentId: 12, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'San Miguel Oeste', codeMH: '23', departmentId: 12, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Morazán Norte', codeMH: '27', departmentId: 13, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Morazán Sur', codeMH: '28', departmentId: 13, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'La Union Norte', codeMH: '19', departmentId: 14, state: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'La Union Sur', codeMH: '20', departmentId: 14, state: 1, createdAt: new Date(), updatedAt: new Date() }
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
