import { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../contexts/AppContext';
import { assets } from '../../assets/assets';

const CATEGORIES = ['Vegetables', 'Fruits', 'Dairy', 'Drinks', 'Grains', 'Bakery', 'Instant'];

const inputClass = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-[#16D291] focus:bg-white transition-all placeholder-gray-400';

const SellerAddProduct = () => {
  const { setToast, setSellerProducts, navigate, API } = useAppContext();
  const [form, setForm] = useState({
    name: '', category: 'Vegetables', price: '', offerPrice: '',
    description: '', inStock: true,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.offerPrice) {
      setToast({ type: 'error', title: 'Missing Fields', message: 'Fill in all required fields.' });
      return;
    }
    if (Number(form.offerPrice) > Number(form.price)) {
      setToast({ type: 'error', title: 'Invalid Price', message: 'Offer price cannot exceed original price.' });
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('offerPrice', form.offerPrice);
      formData.append('description', form.description);
      formData.append('inStock', form.inStock);
      if (image) formData.append('image', image);

      const { data } = await axios.post(`${API}/api/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        setSellerProducts((prev) => [{ ...data.product, isNew: true, image: data.product.image?.length ? data.product.image : [] }, ...prev]);
        setToast({ type: 'success', title: 'Product Added!', message: `"${form.name}" is now listed.` });
        setForm({ name: '', category: 'Vegetables', price: '', offerPrice: '', description: '', inStock: true });
        setImage(null);
        setPreview(null);
        navigate('/seller/products');
      } else {
        setToast({ type: 'error', title: 'Failed', message: data.message });
      }
    } catch {
      setToast({ type: 'error', title: 'Error', message: 'Could not add product. Try again.' });
    }
    setSaving(false);
  };

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>
        <p className="text-sm text-gray-400 mt-1">Fill in the details to list a new product</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">

        {/* Left */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-700 mb-5">Product Info</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Product Name *</label>
                <input name="name" value={form.name} onChange={handle} placeholder="e.g. Organic Tomatoes 500g" className={inputClass} required />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Category *</label>
                <select name="category" value={form.category} onChange={handle} className={inputClass}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Original Price *</label>
                  <input name="price" type="number" value={form.price} onChange={handle} placeholder="0.00" className={inputClass} required min="0" step="0.01" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Offer Price *</label>
                  <input name="offerPrice" type="number" value={form.offerPrice} onChange={handle} placeholder="0.00" className={inputClass} required min="0" step="0.01" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handle}
                  placeholder="Enter product description..."
                  rows={4}
                  className={inputClass + ' resize-none'}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" name="inStock" checked={form.inStock} onChange={handle} className="sr-only" />
                  <div className={`w-10 h-5 rounded-full transition-colors ${form.inStock ? 'bg-[#16D291]' : 'bg-gray-300'}`} />
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.inStock ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm font-semibold text-gray-700">In Stock</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-5">
          {/* Image upload */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-gray-700 mb-4">Product Image</h2>
            <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#16D291] transition-colors cursor-pointer bg-gray-50">
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-xl p-2" />
              ) : (
                <>
                  <img src={assets.upload_area} alt="" className="w-10 h-10 opacity-30 mb-2" />
                  <p className="text-xs text-gray-400 text-center">Click to upload<br />PNG, JPG up to 5MB</p>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-2xl text-white font-bold text-sm tracking-wide active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg,#16D291,#12b87a)', boxShadow: '0 4px 16px rgba(22,210,145,0.35)' }}
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Saving...
              </>
            ) : '+ Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerAddProduct;
