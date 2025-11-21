import mongoose from 'mongoose';

const canonicalHosts = [
  'https://www.balajisphere.com',
  'http://www.balajisphere.com',
  'https://balajisphere.com',
  'http://balajisphere.com',
];

const ProductSchema = new mongoose.Schema(
  {
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
      new mongoose.Schema(
        {
          size: { type: String },
          color: { type: String },
          pack: { type: String },
          price: { type: Number, required: true },
          stockQty: { type: Number, default: 0 },
          inStock: { type: Boolean },
          sku: { type: String },
        },
        { _id: false }
      ),
    ],
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

function normalizeImageUrl(url = '') {
  let normalized = url.trim();
  if (!normalized) return '';

  for (const host of canonicalHosts) {
    if (normalized.startsWith(host)) {
      normalized = normalized.slice(host.length);
      break;
    }
  }

  const isAbsolute =
    normalized.startsWith('http') ||
    normalized.startsWith('/') ||
    normalized.startsWith('data:') ||
    normalized.startsWith('blob:');

  if (!isAbsolute) {
    normalized = `/${normalized}`;
  }

  return normalized;
}

async function trimProductImages() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/balajisphere';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const products = await Product.find({ image: { $exists: true } });
  let updatedCount = 0;

  for (const product of products) {
    const original = product.image || '';
    const normalized = normalizeImageUrl(original);

    if (normalized !== original) {
      product.image = normalized;
      await product.save();
      updatedCount++;
      console.log(`Fixed image for ${product.name}: "${original}" -> "${normalized}"`);
    }
  }

  console.log(`Finished updating ${updatedCount} product image URLs.`);
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

trimProductImages().catch(async (error) => {
  console.error('Error trimming product images:', error);
  await mongoose.disconnect();
  process.exit(1);
});

