import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';

const inputClass = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-[#16D291] focus:bg-white transition-all placeholder-gray-400';

const EMPTY = { firstName:'', lastName:'', email:'', phone:'', street:'', city:'', state:'', zip:'', country:'' };

const FIELDS = [
  { name:'firstName', label:'First Name',     placeholder:'John' },
  { name:'lastName',  label:'Last Name',      placeholder:'Doe' },
  { name:'email',     label:'Email',          placeholder:'you@example.com', type:'email', span:2 },
  { name:'phone',     label:'Phone',          placeholder:'+1 234 567 890',  type:'tel' },
  { name:'street',    label:'Street Address', placeholder:'123 Main St',     span:2 },
  { name:'city',      label:'City',           placeholder:'New York' },
  { name:'state',     label:'State',          placeholder:'NY' },
  { name:'zip',       label:'ZIP Code',       placeholder:'10001' },
  { name:'country',   label:'Country',        placeholder:'United States' },
];

const AddressBook = () => {
  const { API, user, navigate, setToast } = useAppContext();

  const [addresses, setAddresses]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editId, setEditId]         = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/address`);
      if (data.success) setAddresses(data.addresses);
    } catch {}
    setLoading(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (addr) => {
    setEditId(addr._id);
    setForm({
      firstName: addr.firstName, lastName: addr.lastName,
      email: addr.email, phone: addr.phone,
      street: addr.street, city: addr.city,
      state: addr.state, zip: addr.zip, country: addr.country,
    });
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const { data } = await axios.put(`${API}/api/address/${editId}`, form);
        if (data.success) {
          setAddresses((prev) => prev.map((a) => a._id === editId ? data.address : a));
          setToast({ type: 'success', title: 'Updated', message: 'Address updated.' });
        }
      } else {
        const { data } = await axios.post(`${API}/api/address`, form);
        if (data.success) {
          setAddresses((prev) => [...prev, data.address]);
          setToast({ type: 'success', title: 'Added', message: 'Address saved.' });
        }
      }
      setShowForm(false);
    } catch {
      setToast({ type: 'error', title: 'Error', message: 'Could not save address.' });
    }
    setSaving(false);
  };

  const deleteAddress = async (id) => {
    try {
      await axios.delete(`${API}/api/address/${id}`);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      setToast({ type: 'success', title: 'Deleted', message: 'Address removed.' });
    } catch {
      setToast({ type: 'error', title: 'Error', message: 'Could not delete address.' });
    }
  };

  const setDefault = async (id) => {
    try {
      const { data } = await axios.patch(`${API}/api/address/${id}/default`);
      if (data.success) {
        setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a._id === id })));
        setToast({ type: 'success', title: 'Default Set', message: 'Default address updated.' });
      }
    } catch {}
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#16D291' }}>Account</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Address Book</h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold active:scale-95 transition-all"
          style={{ background: '#16D291' }}
        >
          + Add Address
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <svg className="w-8 h-8 animate-spin" style={{ color: '#16D291' }} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        </div>
      )}

      {/* Empty */}
      {!loading && addresses.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">📍</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No addresses saved</h2>
          <p className="text-sm text-gray-400 mb-6">Add an address for faster checkout.</p>
          <button onClick={openAdd} className="px-7 py-3 rounded-full text-white font-semibold text-sm" style={{ background: '#16D291' }}>
            Add Address
          </button>
        </div>
      )}

      {/* Address cards */}
      {!loading && addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {addresses.map((addr) => (
            <div key={addr._id} className={`bg-white rounded-2xl border-2 p-5 shadow-sm transition-all ${addr.isDefault ? 'border-[#16D291]' : 'border-gray-100'}`}>
              {addr.isDefault && (
                <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mb-3" style={{ background: '#f0fdf9', color: '#16D291' }}>
                  ✓ Default
                </span>
              )}
              <p className="text-sm font-bold text-gray-800 mb-1">{addr.firstName} {addr.lastName}</p>
              <p className="text-xs text-gray-500">{addr.street}</p>
              <p className="text-xs text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
              <p className="text-xs text-gray-500">{addr.country}</p>
              <p className="text-xs text-gray-400 mt-1">📞 {addr.phone}</p>
              <p className="text-xs text-gray-400">✉️ {addr.email}</p>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(addr)} className="text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors" style={{ color: '#16D291' }}>
                  Edit
                </button>
                {!addr.isDefault && (
                  <button onClick={() => setDefault(addr._id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                    Set Default
                  </button>
                )}
                <button onClick={() => deleteAddress(addr._id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors ml-auto">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 max-w-2xl">
          <h2 className="text-base font-bold text-gray-800 mb-5">{editId ? 'Edit Address' : 'New Address'}</h2>
          <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map(({ name, label, placeholder, type = 'text', span }) => (
              <div key={name} className={span === 2 ? 'sm:col-span-2' : ''}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{label}</label>
                <input name={name} type={type} value={form[name]} onChange={handleChange} placeholder={placeholder} className={inputClass} required />
              </div>
            ))}

            <div className="sm:col-span-2 flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-xl text-white text-sm font-bold active:scale-95 transition-all disabled:opacity-60"
                style={{ background: '#16D291' }}
              >
                {saving ? 'Saving...' : editId ? 'Update Address' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
