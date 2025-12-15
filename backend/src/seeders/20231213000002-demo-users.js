'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('User@123', saltRounds);

    await queryInterface.bulkInsert('users', [
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        password: hashedPassword,
        phone: '555-0101',
        shippingAddress: '123 Main St, Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob@example.com',
        password: hashedPassword,
        phone: '555-0102',
        shippingAddress: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Carol',
        lastName: 'Williams',
        email: 'carol@example.com',
        password: hashedPassword,
        phone: '555-0103',
        shippingAddress: '789 Pine Road',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
        country: 'USA',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
