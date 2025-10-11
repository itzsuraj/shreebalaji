const mongoose = require('mongoose');
const { products } = require('../src/data/products.ts');

// Product Schema (matching the existing Product model)
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  features: [{ type: String }],
  specifications: { type: mongoose.Schema.Types.Mixed },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  packs: [{ type: String }],
  variants: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

async function seedProducts() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/balajisphere';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Successfully seeded ${insertedProducts.length} products`);

    // Display some statistics
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\nProducts by category:');
    categories.forEach(cat => {
      console.log(`- ${cat._id}: ${cat.count} products`);
    });

    console.log('\nSeeding completed successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
seedProducts();
