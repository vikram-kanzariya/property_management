'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('channels', [
      {
        property_id:7,
        owner_id:8,
        contractor_id:3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        property_id:7,
        owner_id:8,
        contractor_id:2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
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
