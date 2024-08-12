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
    await queryInterface.bulkInsert('Billers', [
      {
        name: 'CENTRO INTEGRAL PSICOLOGICO SALVADOREÑO, S.A. DE C.V.',
        comercialName: 'CIPSA',
        nit: '06142106121037',
        nrc: '2179189',
        activity: 'Otros Servicio relacionados con la salud ncp',
        activityCode: '86909',
        address: 'EJEMPLO DIRECCIÓN',
        phone: '22222222',
        email: 'fesv@cipsa.com.sv',
        state: 1,
        establishmentType: '02',
        establishmentCode: 'M001',
        posCode: 'P001',
        municipalityId: 1,
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
