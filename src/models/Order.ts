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

const OrderTimelineSchema = new Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String },
  updatedBy: { type: String, default: 'system' },
}, { _id: false });

const FulfillmentSchema = new Schema({
  status: { type: String, enum: ['unfulfilled', 'partial', 'fulfilled'], default: 'unfulfilled' },
  trackingNumber: { type: String },
  carrier: { type: String },
  trackingUrl: { type: String },
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
  estimatedDelivery: { type: Date },
  items: [{
    itemIndex: { type: Number, required: true },
    quantity: { type: Number, required: true },
    fulfilledAt: { type: Date },
  }],
}, { _id: false, timestamps: true });

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, unique: true, sparse: true }, // Human-readable order number
    
    items: { type: [OrderItemSchema], required: true },
    subtotalInPaise: { type: Number, required: true },
    shippingInPaise: { type: Number, required: true },
    gstInPaise: { type: Number, required: true },
    totalInPaise: { type: Number, required: true },

    customer: { type: AddressSchema, required: true },

    payment: {
      method: { type: String, enum: ['UPI', 'COD'], required: true },
      status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'], default: 'pending' },
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
      refundedAmount: { type: Number, default: 0 },
    },

    status: { type: String, enum: ['created', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'], default: 'created' },
    
    // Fulfillment tracking (Shopify-style)
    fulfillment: { type: FulfillmentSchema },
    
    // Order timeline (Shopify-style)
    timeline: { type: [OrderTimelineSchema], default: [] },
    
    // Notes system
    notes: { type: String }, // Legacy - keep for backward compatibility
    internalNotes: { type: String }, // Admin-only notes
    customerNotes: { type: String }, // Visible to customer
    
    // Tags for organization
    tags: [{ type: String }],
    
    // Legacy fields (keep for backward compatibility)
    trackingNumber: { type: String },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true }
);

export type OrderDocument = InferSchemaType<typeof OrderSchema> & mongoose.Document;

const OrderModel = models.Order || model('Order', OrderSchema);

// Generate order number before save
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await OrderModel.countDocuments();
    this.orderNumber = `ORD-${Date.now().toString().slice(-8)}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

export default OrderModel;
