import mongoose, { Schema, InferSchemaType, models, model } from 'mongoose';

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true }, // in INR
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
  category: { type: String },
  sku: { type: String },
  size: { type: String },
  color: { type: String },
  pack: { type: String },
});

const AddressSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'IN' },
  gstin: { type: String },
});

const OrderSchema = new Schema(
  {
    items: { type: [OrderItemSchema], required: true },
    subtotalInPaise: { type: Number, required: true },
    shippingInPaise: { type: Number, required: true },
    gstInPaise: { type: Number, required: true },
    totalInPaise: { type: Number, required: true },

    customer: { type: AddressSchema, required: true },

    payment: {
      method: { type: String, enum: ['UPI', 'COD'], required: true },
      status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
    },

    status: { type: String, enum: ['created', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'created' },
    trackingNumber: { type: String },
    estimatedDelivery: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

export type OrderDocument = InferSchemaType<typeof OrderSchema> & mongoose.Document;

export default models.Order || model('Order', OrderSchema);


