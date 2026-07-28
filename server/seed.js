/**
 * Seed script — run once to populate MongoDB with initial products
 * Usage: node server/seed.js
 */
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import Product from './models/Product.js';

dotenv.config({ path: path.resolve('server/.env') });

const products = [
  // Vegetables
  { name: 'Potato 500g',    category: 'Vegetables', price: 25,  offerPrice: 20,  image: ['potato_image_1.png'],       description: ['Fresh and organic', 'Rich in carbohydrates', 'Ideal for curries and fries'], inStock: true },
  { name: 'Tomato 1 kg',    category: 'Vegetables', price: 40,  offerPrice: 35,  image: ['tomato_image.png'],         description: ['Juicy and ripe', 'Rich in Vitamin C', 'Perfect for salads and sauces'], inStock: true },
  { name: 'Carrot 500g',    category: 'Vegetables', price: 30,  offerPrice: 28,  image: ['carrot_image.png'],         description: ['Sweet and crunchy', 'Good for eyesight', 'Ideal for juices and salads'], inStock: true },
  { name: 'Spinach 500g',   category: 'Vegetables', price: 18,  offerPrice: 15,  image: ['spinach_image_1.png'],      description: ['Rich in iron', 'High in vitamins', 'Perfect for soups and salads'], inStock: true },
  { name: 'Onion 500g',     category: 'Vegetables', price: 22,  offerPrice: 19,  image: ['onion_image_1.png'],        description: ['Fresh and pungent', 'Perfect for cooking', 'A kitchen staple'], inStock: true },
  // Fruits
  { name: 'Apple 1 kg',     category: 'Fruits',     price: 120, offerPrice: 110, image: ['apple_image.png'],          description: ['Crisp and juicy', 'Rich in fiber', 'Boosts immunity'], inStock: true },
  { name: 'Orange 1 kg',    category: 'Fruits',     price: 80,  offerPrice: 75,  image: ['orange_image.png'],         description: ['Juicy and sweet', 'Rich in Vitamin C'], inStock: true },
  { name: 'Banana 1 kg',    category: 'Fruits',     price: 50,  offerPrice: 45,  image: ['banana_image_1.png'],       description: ['Sweet and ripe', 'High in potassium'], inStock: true },
  { name: 'Mango 1 kg',     category: 'Fruits',     price: 150, offerPrice: 140, image: ['mango_image_1.png'],        description: ['Sweet and flavorful', 'Rich in Vitamin A'], inStock: true },
  { name: 'Grapes 500g',    category: 'Fruits',     price: 70,  offerPrice: 65,  image: ['grapes_image_1.png'],       description: ['Fresh and juicy', 'Rich in antioxidants'], inStock: true },
  // Dairy
  { name: 'Amul Milk 1L',   category: 'Dairy',      price: 60,  offerPrice: 55,  image: ['amul_milk_image.png'],      description: ['Pure and fresh', 'Rich in calcium'], inStock: true },
  { name: 'Paneer 200g',    category: 'Dairy',      price: 90,  offerPrice: 85,  image: ['paneer_image.png'],         description: ['Soft and fresh', 'Rich in protein'], inStock: true },
  { name: 'Eggs 12 pcs',    category: 'Dairy',      price: 90,  offerPrice: 85,  image: ['eggs_image.png'],           description: ['Farm fresh', 'Rich in protein'], inStock: true },
  { name: 'Cheese 200g',    category: 'Dairy',      price: 140, offerPrice: 130, image: ['cheese_image.png'],         description: ['Creamy and delicious', 'Perfect for pizzas'], inStock: true },
  // Drinks
  { name: 'Coca-Cola 1.5L', category: 'Drinks',     price: 80,  offerPrice: 75,  image: ['coca_cola_image.png'],      description: ['Refreshing and fizzy', 'Best served chilled'], inStock: true },
  { name: 'Pepsi 1.5L',     category: 'Drinks',     price: 78,  offerPrice: 73,  image: ['pepsi_image.png'],          description: ['Chilled and refreshing'], inStock: true },
  { name: 'Sprite 1.5L',    category: 'Drinks',     price: 79,  offerPrice: 74,  image: ['sprite_image_1.png'],       description: ['Refreshing citrus taste'], inStock: true },
  { name: 'Fanta 1.5L',     category: 'Drinks',     price: 77,  offerPrice: 72,  image: ['fanta_image_1.png'],        description: ['Sweet and fizzy'], inStock: true },
  // Grains
  { name: 'Basmati Rice 5kg',  category: 'Grains',  price: 550, offerPrice: 520, image: ['basmati_rice_image.png'],   description: ['Long grain and aromatic', 'Perfect for biryani'], inStock: true },
  { name: 'Wheat Flour 5kg',   category: 'Grains',  price: 250, offerPrice: 230, image: ['wheat_flour_image.png'],    description: ['High-quality whole wheat'], inStock: true },
  { name: 'Brown Rice 1kg',    category: 'Grains',  price: 120, offerPrice: 110, image: ['brown_rice_image.png'],     description: ['Whole grain and nutritious'], inStock: true },
  { name: 'Organic Quinoa 500g',category:'Grains',  price: 450, offerPrice: 420, image: ['quinoa_image.png'],         description: ['High in protein and fiber', 'Gluten-free'], inStock: true },
  // Bakery
  { name: 'Brown Bread 400g',       category: 'Bakery', price: 40,  offerPrice: 35,  image: ['brown_bread_image.png'],        description: ['Soft and healthy', 'Made from whole wheat'], inStock: true },
  { name: 'Butter Croissant 100g',  category: 'Bakery', price: 50,  offerPrice: 45,  image: ['butter_croissant_image.png'],   description: ['Flaky and buttery', 'Freshly baked'], inStock: true },
  { name: 'Chocolate Cake 500g',    category: 'Bakery', price: 350, offerPrice: 325, image: ['chocolate_cake_image.png'],     description: ['Rich and moist', 'Made with premium cocoa'], inStock: true },
  { name: 'Vanilla Muffins 6 pcs',  category: 'Bakery', price: 100, offerPrice: 90,  image: ['vanilla_muffins_image.png'],    description: ['Soft and fluffy', 'Made with real vanilla'], inStock: true },
  // Instant
  { name: 'Maggi Noodles 280g',  category: 'Instant', price: 55,  offerPrice: 50,  image: ['maggi_image.png'],           description: ['Instant and easy to cook', 'Delicious taste'], inStock: true },
  { name: 'Top Ramen 270g',      category: 'Instant', price: 45,  offerPrice: 40,  image: ['top_ramen_image.png'],       description: ['Quick and easy to prepare'], inStock: true },
  { name: 'Knorr Cup Soup 70g',  category: 'Instant', price: 35,  offerPrice: 30,  image: ['knorr_soup_image.png'],      description: ['Convenient for on-the-go'], inStock: true },
  { name: 'Yippee Noodles 260g', category: 'Instant', price: 50,  offerPrice: 45,  image: ['yippee_image.png'],          description: ['Non-fried noodles for healthier choice'], inStock: true },
];

const seed = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/FreshMart`);
    console.log('Connected to MongoDB');

    // Always re-seed (clear and re-insert)
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
