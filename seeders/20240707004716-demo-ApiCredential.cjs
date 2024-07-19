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
    await queryInterface.bulkInsert('ApiCredentials', [
      {
        name: 'FIRMADOR',
        code: 'MH_SIGNER',
        url: 'http://172.16.17.19:8113/firmardocumento',
        sandbox: 0,
        state: 1,
        user: '06142106121037',
        password: 'CIPSA2024.',
        token: null,
        tokenExpire: null,
        response: null,
        refreshToken: null,
        refreshTokenExpire: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'FESV API',
        code: 'MH_FE_API',
        url: 'https://apitest.dtes.mh.gob.sv',
        sandbox: 1,
        state: 1,
        user: '06142106121037',
        password: 'Cipsa2024$',
        token: null,
        tokenExpire: null,
        response: null,
        refreshToken: null,
        refreshTokenExpire: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'CONSULTA DTE',
        code: 'MH_FE_CONSULT',
        url: 'https://admin.factura.gob.sv/prod/consulta/consulta-ssc/dte',
        sandbox: 1,
        state: 1,
        user: null,
        password: null,
        token: null,
        tokenExpire: null,
        response: null,
        refreshToken: null,
        refreshTokenExpire: null,
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
