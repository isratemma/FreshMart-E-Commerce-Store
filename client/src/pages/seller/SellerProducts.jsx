import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../../contexts/AppContext';

const CATEGORIES = ['Vegetables', 'Fruits', 'Dairy', 'Drinks', 'Grains', 'Bakery', 'Instant'];
const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-[#16D291] focus:bg-white transition-all placeholder-gray-400';

const SellerProducts = () => {
  const { currency, sellerProducts, setSellerProducts, setToast, API } = useAppContext();
  const [search, setSearch] = useState('');
  const [editProduct, setEditProduct] = useState(null); // product being edited
  const [editForm, setEditForm] = useState({});

  const filtered = sellerProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (p) => {
    setEditProduct(p._id);
    setEditForm({
      name: p.name,
      category: p.category,
      price: p.price,
      offerPrice: p.offerPrice,
      inStock: p.inStock,
      description: Array.isArray(p.description) ? p.description.join('\n') : p.description,
    });
  };

  const saveEdit = async () => {
    if (!editForm.name || !editForm.price || !editForm.offerPrice) {
      setToast({ type: 'error', title: 'Missing Fields', message: 'Fill in all required fields.' });
      return;
    }
    const updated = {
      name: editForm.name,
      category: editForm.category,
      price: Number(editForm.price),
      offerPrice: Number(editForm.offerPrice),
      inStock: editForm.inStock,
      description: editForm.description.split('\n').filter(Boolean),
    };
    setSellerProducts((prev) =>
      prev.map((p) => p._id === editProduct ? { ...p, ...updated } : p)
    );
    try {
      await axios.put(`${API}/api/products/${editProduct}`, updated);
      setToast({ type: 'success', title: 'Saved', message: 'Product updated successfully.' });
    } catch {
      setToast({ type: 'error', title: 'Error', message: 'Could not save changes.' });
    }
    setEditProduct(null);
  };

  const deleteProduct = async (id) => {
    setSellerProducts((prev) => prev.filter((p) => p._id !== id));
    try {
      await axios.delete(`${API}/api/products/${id}`);
      setToast({ type: 'success', title: 'Deleted', message: 'Product removed.' });
    } catch {
      setToast({ type: 'error', title: 'Error', message: 'Could not delete product.' });
    }
  };

  const toggleStock = async (id) => {
    setSellerProducts((prev) =>
      prev.map((p) => p._id === id ? { ...p, inStock: !p.inStock } : p)
    );
    try {
      await axios.patch(`${API}/api/products/${id}/stock`);
    } catch {
      // revert on failure
      setSellerProducts((prev) =>
        prev.map((p) => p._id === id ? { ...p, inStock: !p.inStock } : p)
      );
    }
  };

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-400 mt-1">{filtered.length} products</p>
        </div>
        <Link
          to="/seller/add"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95"
          style={{ background: '#16D291' }}
        >
          + Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl mb-5 w-full max-w-sm focus-within:border-[#16D291] transition-colors">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3 bg-gray-50 border-b border-gray-100">
          <span className="col-span-5">Product</span>
          <span className="col-span-2 text-center">Category</span>
          <span className="col-span-2 text-center">Price</span>
          <span className="col-span-1 text-center">Stock</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.map((p) => {
            const discount = Math.round(((p.price - p.offerPrice) / p.price) * 100);
            const isEditing = editProduct === p._id;

            return (
              <div key={p._id}>
                {/* Row */}
                <div className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="col-span-12 sm:col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      <img src={p.image[0]} alt={p.name} className="w-full h-full object-contain p-1" loading="lazy" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                        {p.isNew && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-500">New</span>}
                      </div>
                      {discount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#f0fdf9] text-[#16D291]">-{discount}%</span>
                      )}
                    </div>
                  </div>
                  <div className="hidden sm:block col-span-2 text-center">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{p.category}</span>
                  </div>
                  <div className="hidden sm:block col-span-2 text-center">
                    <p className="text-sm font-bold text-gray-800">{currency}{p.offerPrice}</p>
                    {p.price !== p.offerPrice && <p className="text-xs text-gray-400 line-through">{currency}{p.price}</p>}
                  </div>
                  <div className="hidden sm:flex col-span-1 justify-center">
                    {/* Toggle stock */}
                    <button onClick={() => toggleStock(p._id)} className="relative w-9 h-5 rounded-full transition-colors focus:outline-none" style={{ background: p.inStock ? '#16D291' : '#e5e7eb' }}>
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${p.inStock ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>
                  <div className="hidden sm:flex col-span-2 justify-end gap-1.5">
                    <button
                      onClick={() => isEditing ? setEditProduct(null) : openEdit(p)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isEditing ? 'bg-gray-100 text-gray-600' : 'bg-[#f0fdf9] text-[#16D291] hover:bg-[#d0f7eb]'}`}
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Inline edit form */}
                {isEditing && (
                  <div className="px-5 pb-5 pt-2 bg-[#f9fffe] border-t border-[#d0f7eb]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="lg:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Product Name</label>
                        <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Category</label>
                        <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className={inputClass}>
                          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Original Price</label>
                        <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className={inputClass} min="0" step="0.01" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Offer Price</label>
                        <input type="number" value={editForm.offerPrice} onChange={(e) => setEditForm({ ...editForm, offerPrice: e.target.value })} className={inputClass} min="0" step="0.01" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Stock</label>
                        <select value={editForm.inStock ? 'true' : 'false'} onChange={(e) => setEditForm({ ...editForm, inStock: e.target.value === 'true' })} className={inputClass}>
                          <option value="true">In Stock</option>
                          <option value="false">Out of Stock</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Description (one point per line)</label>
                        <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} className={inputClass + ' resize-none'} />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={saveEdit}
                        className="px-6 py-2.5 rounded-xl text-white text-sm font-bold active:scale-95 transition-all"
                        style={{ background: '#16D291' }}
                      >
                        Save Changes
                      </button>
                      <button onClick={() => setEditProduct(null)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SellerProducts;
