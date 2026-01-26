import mongoose, { Schema, InferSchemaType, models, model } from 'mongoose';

const BlogSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true }, // HTML content
  category: { 
    type: String, 
    enum: ['Buttons', 'Zippers', 'Elastic', 'Cords', 'Industry', 'Tips', 'Market Trends', 'Product Updates'],
    default: 'Industry'
  },
  featuredImage: { type: String },
  author: { type: String, default: 'Shree Balaji Enterprises' },
  readTime: { type: String, default: '5 min read' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  publishedAt: { type: Date },
  seoTitle: { type: String },
  seoDescription: { type: String },
  seoKeywords: { type: String },
  relatedProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  tags: [{ type: String }],
}, { timestamps: true });

// Create index for status and publishedAt (slug already has unique index from schema)
BlogSchema.index({ status: 1, publishedAt: -1 });

export type BlogDocument = InferSchemaType<typeof BlogSchema> & mongoose.Document;

export default models.Blog || model('Blog', BlogSchema);
