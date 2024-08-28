'use strict';

const bycrypt = require('bcrypt');

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

    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Admin',
        lastName: 'User',
        dui: '00000000-0',
        email: 'admin@example',
        password: bycrypt.hashSync('123456', 12),
        state: 1,
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        dui: '00000000-1',
        email: 'johndoe@example',
        password: bycrypt.hashSync('123456', 12),
        state: 1,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        dui: '00000000-2',
        email: 'janedoe@example',
        password: bycrypt.hashSync('123456', 12),
        state: 1,
        roleId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Prueba',
        lastName: 'Cipsa',
        dui: '00000000-3',
        email: 'prueba@cipsa.com.sv',
        password: bycrypt.hashSync('123456', 12),
        state: 1,
        roleId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {}
    );
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
