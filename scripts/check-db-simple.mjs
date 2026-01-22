import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to read .env files
function loadEnv() {
  const envFiles = [
    join(__dirname, '..', '.env.production.local'),
    join(__dirname, '..', '.env.local'),
    join(__dirname, '..', '.env'),
  ];
  
  for (const envFile of envFiles) {
    try {
      const content = readFileSync(envFile, 'utf-8');
      content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match && !process.env[match[1]]) {
          process.env[match[1]] = match[2].trim();
        }
      });
      console.log(`✅ Loaded env from: ${envFile}`);
      break;
    } catch (e) {
      // File doesn't exist, continue
    }
  }
}

loadEnv();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/balajisphere';

console.log('🔌 Connecting to database...');
console.log('📍 Connection string:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

try {
  await mongoose.connect(mongoUri, {
    bufferCommands: false,
    maxPoolSize: 5,
  });
  
  console.log('✅ Connected to database\n');
  
  // Define Product schema (simple version)
  const ProductSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });
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
      console.log(`      ID: ${String(p._id)}`);
      console.log(`      Created: ${p.createdAt || 'N/A'}`);
      console.log('');
    });
    
    // Check for products with variants
    const productsWithVariants = await Product.find({
      variantPricing: { $exists: true, $ne: [] }
    })
      .select('_id name variantPricing')
      .lean()
      .then(products => products.filter(p => p.variantPricing && Array.isArray(p.variantPricing) && p.variantPricing.length > 0));
    
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
  if (error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
}
