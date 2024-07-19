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
    await queryInterface.bulkInsert('Correlatives', [
      {
        mask: 'COR0001',
        name: 'FACTURA',
        codeMH: '01',
        initial: 1,
        actual: 0,
        final: 1000000,
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mask: 'COR0002',
        name: 'COMPROBANTE DE CRÉDITO FISCAL',
        codeMH: '03',
        initial: 1,
        actual: 0,
        final: 1000000,
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mask: 'COR0003',
        name: 'NOTA DE REMISIÓN',
        codeMH: '04',
        initial: 1,
        actual: 0,
        final: 1000000,
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mask: 'COR0004',
        name: 'NOTA DE CRÉDITO',
        codeMH: '05',
        initial: 1,
        actual: 0,
        final: 1000000,
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mask: 'COR0005',
        name: 'NOTA DE DÉBITO',
        codeMH: '06',
        initial: 1,
        actual: 0,
        final: 1000000,
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mask: 'COR0006',
        name: 'COMPROBATE DE RETENCIÓN',
        codeMH: '07',
        initial: 1,
        actual: 0,
        final: 1000000,
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mask: 'COR0007',
        name: 'COMPROBATE DE LIQUIDACIÓN',
        codeMH: '08',
        initial: 1,
        actual: 0,
        final: 1000000,
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mask: 'COR0008',
        name: 'DOCUMENTO CONTABLE DE LIQUIDACIÓN',
        codeMH: '09',
        initial: 1,
        actual: 0,
        final: 1000000,
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mask: 'COR0009',
        name: 'FACTURA DE EXPORTACIÓN',
        codeMH: '11',
        initial: 1,
        actual: 0,
        final: 1000000,
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mask: 'COR0010',
        name: 'FACTURA DE SUJETO EXCLUIDO',
        codeMH: '14',
        initial: 1,
        actual: 0,
        final: 1000000,
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mask: 'COR0011',
        name: 'COMPROBANTE DE DONACIÓN',
        codeMH: '15',
        initial: 1,
        actual: 0,
        final: 1000000,
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
