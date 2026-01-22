import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });
dotenv.config({ path: join(__dirname, '..', '.env.production.local') });
dotenv.config({ path: join(__dirname, '..', '.env') });

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('❌ MONGODB_URI is not set in environment variables');
  process.exit(1);
}

console.log('🔌 Connecting to database...');
console.log('📍 Connection string:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

try {
  await mongoose.connect(mongoUri, {
    bufferCommands: false,
    maxPoolSize: 5,
  });
  
  console.log('✅ Connected to database\n');
  
  // Import Product model
  const ProductSchema = new mongoose.Schema({}, { strict: false });
  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
  
  // Get counts
  const totalCount = await Product.countDocuments();
  const activeCount = await Product.countDocuments({ status: 'active' });
  const draftCount = await Product.countDocuments({ status: 'draft' });
  const noStatusCount = await Product.countDocuments({ 
    $or: [
      { status: { $exists: false } },
      { status: null },
      { status: '' }
    ]
  });
  
  console.log('📊 Database Summary:');
  console.log('   Total Products:', totalCount);
  console.log('   Active Products:', activeCount);
  console.log('   Draft Products:', draftCount);
  console.log('   Products without status:', noStatusCount);
  console.log('');
  
  if (totalCount > 0) {
    console.log('📦 All Products:');
    const allProducts = await Product.find()
      .select('_id name category status createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();
    
    allProducts.forEach((p, index) => {
      console.log(`   ${index + 1}. ${p.name || 'Unnamed'} (${p.category || 'N/A'}) - Status: ${p.status || 'NO STATUS'}`);
      console.log(`      ID: ${p._id}`);
      console.log(`      Created: ${p.createdAt || 'N/A'}`);
      console.log('');
    });
    
    // Check for products with variants
    const productsWithVariants = await Product.find({
      variantPricing: { $exists: true, $ne: [], $size: { $gt: 0 } }
    })
      .select('_id name variantPricing')
      .lean();
    
    if (productsWithVariants.length > 0) {
      console.log('🔀 Products with Variants:');
      productsWithVariants.forEach((p, index) => {
        console.log(`   ${index + 1}. ${p.name || 'Unnamed'} - ${p.variantPricing?.length || 0} variants`);
      });
      console.log('');
    }
  } else {
    console.log('⚠️  No products found in database');
  }
  
  await mongoose.disconnect();
  console.log('✅ Disconnected from database');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
