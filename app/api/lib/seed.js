// /app/lib/seed.js
import connectDB from './db';
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';
import Setting from './models/Setting';
import bcrypt from 'bcryptjs';

/**
 * Seed the database with initial data
 */
export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Check if admin user already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminExists) {
      console.log('Creating admin user...');
      
      // Create admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });
      
      console.log('Admin user created successfully!');
    } else {
      console.log('Admin user already exists, skipping creation.');
    }
    
    // Check if default categories exist
    const categoriesCount = await Category.countDocuments();
    
    if (categoriesCount === 0) {
      console.log('Creating default categories...');
      
      // Create default categories
      const categories = [
        { name: 'Electronics', description: 'Electronic devices and gadgets' },
        { name: 'Clothing', description: 'Apparel and fashion items' },
        { name: 'Home & Kitchen', description: 'Home essentials and kitchen supplies' },
        { name: 'Books', description: 'Books, e-books, and publications' },
        { name: 'Toys & Games', description: 'Toys, games, and entertainment items' },
      ];
      
      await Category.insertMany(categories);
      
      console.log('Default categories created successfully!');
    } else {
      console.log('Categories already exist, skipping creation.');
    }
    
    // Check if default products exist
    const productsCount = await Product.countDocuments();
    
    if (productsCount === 0) {
      console.log('Creating sample products...');
      
      // Get category IDs
      const electronics = await Category.findOne({ name: 'Electronics' });
      const clothing = await Category.findOne({ name: 'Clothing' });
      const homeKitchen = await Category.findOne({ name: 'Home & Kitchen' });
      
      if (electronics && clothing && homeKitchen) {
        // Create sample products
        const products = [
          {
            name: 'Smartphone X',
            description: 'Latest smartphone with advanced features',
            price: 899.99,
            images: ['https://via.placeholder.com/500x500?text=Smartphone'],
            category: electronics._id,
            brand: 'TechBrand',
            stock: 50,
            featured: true,
          },
          {
            name: 'Laptop Pro',
            description: 'High-performance laptop for professionals',
            price: 1299.99,
            images: ['https://via.placeholder.com/500x500?text=Laptop'],
            category: electronics._id,
            brand: 'TechBrand',
            stock: 30,
            featured: true,
          },
          {
            name: 'Wireless Headphones',
            description: 'Premium noise-canceling headphones',
            price: 199.99,
            images: ['https://via.placeholder.com/500x500?text=Headphones'],
            category: electronics._id,
            brand: 'AudioTech',
            stock: 100,
            featured: false,
          },
          {
            name: 'Cotton T-Shirt',
            description: 'Comfortable cotton t-shirt for everyday wear',
            price: 19.99,
            images: ['https://via.placeholder.com/500x500?text=TShirt'],
            category: clothing._id,
            brand: 'FashionCo',
            stock: 200,
            featured: false,
          },
          {
            name: 'Denim Jeans',
            description: 'Classic denim jeans with modern fit',
            price: 49.99,
            images: ['https://via.placeholder.com/500x500?text=Jeans'],
            category: clothing._id,
            brand: 'FashionCo',
            stock: 150,
            featured: true,
          },
          {
            name: 'Coffee Maker',
            description: 'Automatic coffee maker with timer',
            price: 79.99,
            images: ['https://via.placeholder.com/500x500?text=CoffeeMaker'],
            category: homeKitchen._id,
            brand: 'HomeAppliances',
            stock: 45,
            featured: false,
          },
          {
            name: 'Blender',
            description: 'High-power blender for smoothies and more',
            price: 69.99,
            images: ['https://via.placeholder.com/500x500?text=Blender'],
            category: homeKitchen._id,
            brand: 'HomeAppliances',
            stock: 60,
            featured: true,
          },
        ];
        
        await Product.insertMany(products);
        
        console.log('Sample products created successfully!');
      }
    } else {
      console.log('Products already exist, skipping creation.');
    }
    
    // Check if default settings exist
    const settingsCount = await Setting.countDocuments();
    
    if (settingsCount === 0) {
      console.log('Creating default settings...');
      
      // Create default settings
      const settings = [
        {
          key: 'storeName',
          value: 'Your E-Commerce Store',
          group: 'general',
        },
        {
          key: 'storeEmail',
          value: 'info@example.com',
          group: 'general',
        },
        {
          key: 'storePhone',
          value: '+1-555-123-4567',
          group: 'general',
        },
        {
          key: 'storeAddress',
          value: '123 Commerce St, Business City, 12345',
          group: 'general',
        },
        {
          key: 'storeLogo',
          value: '/logo.png',
          group: 'general',
        },
        {
          key: 'storeFavicon',
          value: '/favicon.ico',
          group: 'general',
        },
        {
          key: 'storeCurrency',
          value: 'USD',
          group: 'general',
        },
        {
          key: 'taxRate',
          value: 15,
          group: 'payment',
        },
        {
          key: 'freeShippingThreshold',
          value: 100,
          group: 'payment',
        },
        {
          key: 'standardShippingFee',
          value: 10,
          group: 'payment',
        },
        {
          key: 'paymentMethods',
          value: ['cod'],
          group: 'payment',
        },
        {
          key: 'socialLinks',
          value: {
            facebook: 'https://facebook.com/yourstore',
            twitter: 'https://twitter.com/yourstore',
            instagram: 'https://instagram.com/yourstore',
          },
          group: 'social',
        },
      ];
      
      for (const setting of settings) {
        await Setting.create(setting);
      }
      
      console.log('Default settings created successfully!');
    } else {
      console.log('Settings already exist, skipping creation.');
    }
    
    console.log('Database seeding completed!');
    
    return {
      success: true,
      message: 'Database seeded successfully',
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      message: error.message,
    };
  }
}