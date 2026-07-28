import User from '../models/Users.js';

// GET /api/cart — get user's cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('cartItems');
    if (!user) return res.json({ success: false, message: 'User not found' });
    res.json({ success: true, cartItems: user.cartItems || {} });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// POST /api/cart/add — add one item (increment by 1)
export const addToCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) return res.json({ success: false, message: 'itemId required' });

    const user = await User.findById(req.userId);
    if (!user) return res.json({ success: false, message: 'User not found' });

    const cart = user.cartItems || {};
    cart[itemId] = (cart[itemId] || 0) + 1;
    user.cartItems = cart;
    user.markModified('cartItems');
    await user.save();

    res.json({ success: true, cartItems: user.cartItems });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// POST /api/cart/remove — remove one item (decrement by 1, delete if 0)
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) return res.json({ success: false, message: 'itemId required' });

    const user = await User.findById(req.userId);
    if (!user) return res.json({ success: false, message: 'User not found' });

    const cart = user.cartItems || {};
    if (cart[itemId] > 1) {
      cart[itemId] -= 1;
    } else {
      delete cart[itemId];
    }

    user.cartItems = cart;
    user.markModified('cartItems');
    await user.save();

    res.json({ success: true, cartItems: user.cartItems });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// DELETE /api/cart/item/:itemId — remove item completely regardless of qty
export const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.json({ success: false, message: 'User not found' });

    const cart = user.cartItems || {};
    delete cart[itemId];

    user.cartItems = cart;
    user.markModified('cartItems');
    await user.save();

    res.json({ success: true, cartItems: user.cartItems });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// DELETE /api/cart — clear entire cart
export const clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { cartItems: {} });
    res.json({ success: true, cartItems: {} });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// PUT /api/cart — sync entire cart (bulk update)
export const syncCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    await User.findByIdAndUpdate(req.userId, { cartItems });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
