import mongoose, { Schema, InferSchemaType, models, model } from 'mongoose';

const OfflineOrderSchema = new Schema(
  {
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    gstin: { type: String },
    
    poNumber: { type: String, required: true },
    poFile: { type: String }, // URL to uploaded file (optional)
    poFileName: { type: String },
    itemDescription: { type: String }, // Alternative to file upload
    
    status: { 
      type: String, 
      enum: ['pending', 'reviewed', 'processing', 'completed', 'rejected'], 
      default: 'pending' 
    },
    
    notes: { type: String },
    adminNotes: { type: String },
    
    // Optional: Link to online order if converted
    linkedOrderId: { type: String },
  },
  { timestamps: true }
);

export type OfflineOrderDocument = InferSchemaType<typeof OfflineOrderSchema> & mongoose.Document;

export default models.OfflineOrder || model('OfflineOrder', OfflineOrderSchema);

