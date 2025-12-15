'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest electronic devices and gadgets',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
        parentId: null,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Laptops',
        slug: 'laptops',
        description: 'High-performance laptops for work and gaming',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        parentId: 1,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Latest smartphones with cutting-edge features',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        parentId: 1,
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500',
        parentId: null,
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'Men\'s Clothing',
        slug: 'mens-clothing',
        description: 'Stylish clothing for men',
        image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500',
        parentId: 4,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'Women\'s Clothing',
        slug: 'womens-clothing',
        description: 'Fashion-forward clothing for women',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500',
        parentId: 4,
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Everything for your home',
        image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500',
        parentId: null,
        isActive: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        name: 'Books',
        slug: 'books',
        description: 'Wide selection of books across all genres',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500',
        parentId: null,
        isActive: true,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Gear for sports and outdoor activities',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
        parentId: null,
        isActive: true,
        sortOrder: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        name: 'Toys & Games',
        slug: 'toys-games',
        description: 'Fun toys and games for all ages',
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500',
        parentId: null,
        isActive: true,
        sortOrder: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
