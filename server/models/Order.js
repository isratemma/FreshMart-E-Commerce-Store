import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    name:       String,
    image:      String,
    category:   String,
    offerPrice: Number,
    qty:        Number,
  }],
  address: {
    firstName: String, lastName: String, email: String,
    phone: String, street: String, city: String,
    state: String, zip: String, country: String,
  },
  payMethod:  { type: String, enum: ['cod', 'card', 'upi'], default: 'cod' },
  total:      { type: Number, required: true },
  status:     { type: String, default: 'Order Placed' },
  isPaid:     { type: Boolean, default: false },
}, { timestamps: true });

const Order = mongoose.models.order || mongoose.model('order', orderSchema);
export default Order;
