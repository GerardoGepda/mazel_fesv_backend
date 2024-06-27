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
    await queryInterface.bulkInsert('Submenus', [
      {
        name: 'Menús',
        state: 1,
        order: 1,
        icon: 'menu',
        menuId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'App setting',
        state: 1,
        order: 2,
        menuId: 2,
        icon: 'settings',
        createdAt: new Date(),
        updatedAt: new Date()
      }
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
