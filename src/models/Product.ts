import mongoose, { Schema, InferSchemaType, models, model } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  packs: [{ type: String }],
  // Fast flag for UI; should be derived from stock fields when saving
  inStock: { type: Boolean, default: true },
  // Simple products quantity
  stockQty: { type: Number, default: 0 },
  // Variant-level pricing and stock
  variantPricing: [
    new Schema(
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
});

export type ProductDocument = InferSchemaType<typeof ProductSchema> & mongoose.Document;

export default models.Product || model('Product', ProductSchema);









