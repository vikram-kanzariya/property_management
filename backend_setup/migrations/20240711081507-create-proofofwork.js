'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('proofofworks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      property_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Properties',
          key:'id'
        }
      },
      contractor_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Users',
          key:'id'
        }
      },
      work_title: {
        type: Sequelize.STRING
      },
      work_description: {
        type: Sequelize.TEXT
      },
      comment: {
        type: Sequelize.STRING,
        defaultValue:null,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('proofofworks');
  }
};