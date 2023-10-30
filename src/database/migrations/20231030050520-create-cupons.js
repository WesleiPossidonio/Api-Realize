'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('coupons', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      coupons_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name_coupons: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      coupon_discount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      participating_product: {
        type: Sequelize.STRING,
        allowNull: false,
      }, 
      requirements: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiry_date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      coupon_img: {
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
