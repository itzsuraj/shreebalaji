import mongoose, { Schema, InferSchemaType, models, model } from 'mongoose';

const QuoteRequestSchema = new Schema(
  {
    companyName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    quantity: { type: String },
    message: { type: String },
    
    // Product information (if quote is for specific product)
    productId: { type: String },
    productName: { type: String },
    productCategory: { type: String },
    productSize: { type: String },
    productColor: { type: String },
    productPack: { type: String },
    
    // Status tracking
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'converted', 'closed'],
      default: 'new'
    },
    
    // Admin notes
    adminNotes: { type: String },
    
    // Source tracking
    source: { type: String, default: 'website' }, // website, whatsapp, etc.
  },
  { timestamps: true }
);

export type QuoteRequestDocument = InferSchemaType<typeof QuoteRequestSchema> & mongoose.Document;

export default models.QuoteRequest || model('QuoteRequest', QuoteRequestSchema);
