import Address from '../models/Address.js';

// GET /api/address — get all addresses for logged-in user
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, addresses });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// POST /api/address — add new address
export const addAddress = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, street, city, state, zip, country, isDefault } = req.body;

    if (!firstName || !lastName || !email || !phone || !street || !city || !state || !zip || !country)
      return res.json({ success: false, message: 'All address fields are required' });

    // If this is set as default, unset others
    if (isDefault) {
      await Address.updateMany({ userId: req.userId }, { isDefault: false });
    }

    // If it's the first address, make it default automatically
    const count = await Address.countDocuments({ userId: req.userId });
    const address = await Address.create({
      userId: req.userId,
      firstName, lastName, email, phone,
      street, city, state, zip, country,
      isDefault: isDefault || count === 0,
    });

    res.json({ success: true, address });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// PUT /api/address/:id — update address
export const updateAddress = async (req, res) => {
  try {
    const { isDefault, ...rest } = req.body;

    if (isDefault) {
      await Address.updateMany({ userId: req.userId }, { isDefault: false });
    }

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...rest, ...(isDefault !== undefined ? { isDefault } : {}) },
      { new: true }
    );

    if (!address) return res.json({ success: false, message: 'Address not found' });
    res.json({ success: true, address });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// DELETE /api/address/:id — delete address
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!address) return res.json({ success: false, message: 'Address not found' });

    // If deleted address was default, set the most recent one as default
    if (address.isDefault) {
      const next = await Address.findOne({ userId: req.userId }).sort({ createdAt: -1 });
      if (next) { next.isDefault = true; await next.save(); }
    }

    res.json({ success: true, message: 'Address deleted' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// PATCH /api/address/:id/default — set as default
export const setDefault = async (req, res) => {
  try {
    await Address.updateMany({ userId: req.userId }, { isDefault: false });
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isDefault: true },
      { new: true }
    );
    if (!address) return res.json({ success: false, message: 'Address not found' });
    res.json({ success: true, address });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
