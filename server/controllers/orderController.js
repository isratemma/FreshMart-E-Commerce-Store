import Order from '../models/Order.js';

// POST /api/orders — place order (auth required)
export const placeOrder = async (req, res) => {
  try {
    const { items, address, payMethod, total } = req.body;
    if (!items?.length || !address || !total)
      return res.json({ success: false, message: 'Missing order data' });

    const order = await Order.create({
      userId: req.userId,
      items,
      address,
      payMethod,
      total,
      isPaid: payMethod !== 'cod',
    });
    res.json({ success: true, order });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// GET /api/orders/my — customer's own orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// GET /api/orders — all orders (seller only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// PUT /api/orders/:id/status — update status (seller only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
