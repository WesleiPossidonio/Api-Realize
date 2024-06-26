'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('companies', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name_companies: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      branch_of_activity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      company_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      path_banner: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      path_img: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      path_companies_img: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {
          imageOne: '',
          imageTwo: '',
          imageThree: '',
          imageFour: '',
        },
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('companies')
  },
}
