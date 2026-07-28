import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';

// Helper — upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = 'freshmart/products') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    );
    stream.end(buffer);
  });
// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// POST /api/products — seller only (multipart/form-data)
export const addProduct = async (req, res) => {
  try {
    const { name, category, price, offerPrice, description, inStock } = req.body;
    if (!name || !category || !price || !offerPrice)
      return res.json({ success: false, message: 'Required fields missing' });

    // Upload image if provided
    let imageUrls = [];
    if (req.file) {
      const url = await uploadToCloudinary(req.file.buffer);
      imageUrls = [url];
    }

    const descArray = description
      ? description.split('\n').filter(Boolean)
      : [];

    const product = await Product.create({
      name,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      image: imageUrls,
      description: descArray,
      inStock: inStock !== 'false',
    });

    res.json({ success: true, product });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// PUT /api/products/:id — seller only
export const updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Upload new image if provided
    if (req.file) {
      const url = await uploadToCloudinary(req.file.buffer);
      updates.image = [url];
    }

    if (updates.description && typeof updates.description === 'string') {
      updates.description = updates.description.split('\n').filter(Boolean);
    }
    if (updates.price) updates.price = Number(updates.price);
    if (updates.offerPrice) updates.offerPrice = Number(updates.offerPrice);

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// DELETE /api/products/:id — seller only
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// PATCH /api/products/:id/stock — seller only
export const toggleStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.json({ success: false, message: 'Product not found' });
    product.inStock = !product.inStock;
    await product.save();
    res.json({ success: true, inStock: product.inStock });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
