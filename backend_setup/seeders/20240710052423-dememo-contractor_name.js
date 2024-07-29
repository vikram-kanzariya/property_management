'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    return queryInterface.bulkInsert('Estimates', [
      {
        contractor_id:8,
        contractor_name: 'Haresh',
        property_id: 1,
        amount:11000,
        time:"7-days",
        status:0,
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
