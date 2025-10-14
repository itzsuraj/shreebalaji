import mongoose from 'mongoose';

// Product Schema (matching the current model)
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  packs: [{ type: String }],
  inStock: { type: Boolean, default: true },
  stockQty: { type: Number, default: 0 },
  variantPricing: [
    new mongoose.Schema({
      size: { type: String },
      color: { type: String },
      pack: { type: String },
      price: { type: Number, required: true },
      stockQty: { type: Number, default: 0 },
      inStock: { type: Boolean },
      sku: { type: String },
    }, { _id: false })
  ],
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

async function migrateStockFields() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/balajisphere';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find all products that don't have stockQty field
    const productsWithoutStock = await Product.find({
      $or: [
        { stockQty: { $exists: false } },
        { stockQty: null }
      ]
    });

    console.log(`Found ${productsWithoutStock.length} products without stock fields`);

    if (productsWithoutStock.length === 0) {
      console.log('All products already have stock fields. Migration not needed.');
      return;
    }

    // Update each product
    let updatedCount = 0;
    for (const product of productsWithoutStock) {
      const updateData = {
        stockQty: 100, // Default stock for simple products
        inStock: true
      };

      // If product has variantPricing, update those too
      if (product.variantPricing && product.variantPricing.length > 0) {
        updateData.variantPricing = product.variantPricing.map((variant, index) => ({
          ...variant.toObject(),
          stockQty: variant.stockQty || 50, // Default stock for variants
          inStock: variant.inStock !== false,
          sku: variant.sku || `${product._id}-variant-${index + 1}` // Generate SKU if missing
        }));
      }

      await Product.findByIdAndUpdate(product._id, updateData);
      updatedCount++;
      console.log(`Updated product: ${product.name}`);
    }

    console.log(`\nMigration completed! Updated ${updatedCount} products.`);

    // Show final statistics
    const totalProducts = await Product.countDocuments();
    const productsWithStock = await Product.countDocuments({ stockQty: { $exists: true, $ne: null } });
    const productsWithVariants = await Product.countDocuments({ 
      'variantPricing.0': { $exists: true } 
    });

    console.log('\nFinal Statistics:');
    console.log(`- Total products: ${totalProducts}`);
    console.log(`- Products with stock fields: ${productsWithStock}`);
    console.log(`- Products with variants: ${productsWithVariants}`);

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
migrateStockFields();
