import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  sizes: [String],
  colors: [String],
  packs: [String],
  inStock: Boolean,
  stockQty: Number,
  variantPricing: [{
    size: String,
    color: String,
    pack: String,
    price: Number,
    stockQty: Number,
    inStock: Boolean,
    sku: String
  }]
}, { collection: 'products' });

async function checkProductStock() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI not found in environment variables');
      console.error('Please set MONGODB_URI environment variable');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    const Product = mongoose.model('Product', ProductSchema);
    const products = await Product.find({}).sort({ name: 1 });

    console.log(`Total Products: ${products.length}\n`);
    console.log('='.repeat(100));
    console.log('PRODUCT STOCK STATUS REPORT');
    console.log('='.repeat(100));
    console.log();

    let inStockCount = 0;
    let outOfStockCount = 0;
    let withVariantsCount = 0;
    let simpleProductsCount = 0;

    for (const product of products) {
      const hasVariants = product.variantPricing && product.variantPricing.length > 0;
      
      let calculatedInStock = false;
      let stockDetails = '';

      if (hasVariants) {
        withVariantsCount++;
        const variantStock = product.variantPricing.filter((v) => (v.stockQty ?? 0) > 0);
        calculatedInStock = variantStock.length > 0;
        
        if (calculatedInStock) {
          const totalVariantStock = product.variantPricing.reduce((sum, v) => sum + (v.stockQty || 0), 0);
          stockDetails = `Variants: ${variantStock.length}/${product.variantPricing.length} have stock (Total: ${totalVariantStock})`;
        } else {
          stockDetails = `Variants: ${product.variantPricing.length} variants, all out of stock`;
        }
      } else {
        simpleProductsCount++;
        calculatedInStock = (product.stockQty ?? 0) > 0;
        stockDetails = `Simple Product: ${product.stockQty || 0} units`;
      }

      if (calculatedInStock) {
        inStockCount++;
      } else {
        outOfStockCount++;
      }

      const status = calculatedInStock ? '✅ IN STOCK' : '❌ OUT OF STOCK';
      const dbStatus = product.inStock ? '✅' : '❌';
      const statusMatch = calculatedInStock === product.inStock ? '✓' : '⚠️ MISMATCH';

      console.log(`Product: ${product.name}`);
      console.log(`  ID: ${product._id}`);
      console.log(`  Category: ${product.category}`);
      console.log(`  Calculated Status: ${status}`);
      console.log(`  Database inStock: ${dbStatus} ${statusMatch}`);
      console.log(`  ${stockDetails}`);
      
      if (hasVariants && product.variantPricing.length > 0) {
        console.log(`  Variant Details:`);
        product.variantPricing.forEach((v, idx) => {
          const variantStock = (v.stockQty ?? 0) > 0 ? '✅' : '❌';
          console.log(`    ${idx + 1}. ${v.size || 'N/A'} - ${v.color || 'N/A'} - ${v.pack || 'N/A'}: ${variantStock} Stock: ${v.stockQty || 0}`);
        });
      }
      
      console.log();
    }

    console.log('='.repeat(100));
    console.log('SUMMARY');
    console.log('='.repeat(100));
    console.log(`Total Products: ${products.length}`);
    console.log(`✅ In Stock: ${inStockCount}`);
    console.log(`❌ Out of Stock: ${outOfStockCount}`);
    console.log(`📦 Products with Variants: ${withVariantsCount}`);
    console.log(`📝 Simple Products: ${simpleProductsCount}`);
    console.log('='.repeat(100));

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error checking product stock:', error);
    process.exit(1);
  }
}

checkProductStock();

