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
  inStock: { type: Boolean, default: true },
});

export type ProductDocument = InferSchemaType<typeof ProductSchema> & mongoose.Document;

export default models.Product || model('Product', ProductSchema);







