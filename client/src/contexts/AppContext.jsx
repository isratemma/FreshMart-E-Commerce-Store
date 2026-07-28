import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppContext from './AppContext.js';

// Map filename → imported local asset
import potato_image_1 from '../assets/potato_image_1.png';
import tomato_image from '../assets/tomato_image.png';
import carrot_image from '../assets/carrot_image.png';
import spinach_image_1 from '../assets/spinach_image_1.png';
import onion_image_1 from '../assets/onion_image_1.png';
import apple_image from '../assets/apple_image.png';
import orange_image from '../assets/orange_image.png';
import banana_image_1 from '../assets/banana_image_1.png';
import mango_image_1 from '../assets/mango_image_1.png';
import grapes_image_1 from '../assets/grapes_image_1.png';
import amul_milk_image from '../assets/amul_milk_image.png';
import paneer_image from '../assets/paneer_image.png';
import eggs_image from '../assets/eggs_image.png';
import cheese_image from '../assets/cheese_image.png';
import coca_cola_image from '../assets/coca_cola_image.png';
import pepsi_image from '../assets/pepsi_image.png';
import sprite_image_1 from '../assets/sprite_image_1.png';
import fanta_image_1 from '../assets/fanta_image_1.png';
import basmati_rice_image from '../assets/basmati_rice_image.png';
import wheat_flour_image from '../assets/wheat_flour_image.png';
import brown_rice_image from '../assets/brown_rice_image.png';
import quinoa_image from '../assets/quinoa_image.png';
import brown_bread_image from '../assets/brown_bread_image.png';
import butter_croissant_image from '../assets/butter_croissant_image.png';
import chocolate_cake_image from '../assets/chocolate_cake_image.png';
import vanilla_muffins_image from '../assets/vanilla_muffins_image.png';
import maggi_image from '../assets/maggi_image.png';
import top_ramen_image from '../assets/top_ramen_image.png';
import knorr_soup_image from '../assets/knorr_soup_image.png';
import yippee_image from '../assets/yippee_image.png';

const LOCAL_IMAGES = {
  'potato_image_1.png': potato_image_1,
  'tomato_image.png': tomato_image,
  'carrot_image.png': carrot_image,
  'spinach_image_1.png': spinach_image_1,
  'onion_image_1.png': onion_image_1,
  'apple_image.png': apple_image,
  'orange_image.png': orange_image,
  'banana_image_1.png': banana_image_1,
  'mango_image_1.png': mango_image_1,
  'grapes_image_1.png': grapes_image_1,
  'amul_milk_image.png': amul_milk_image,
  'paneer_image.png': paneer_image,
  'eggs_image.png': eggs_image,
  'cheese_image.png': cheese_image,
  'coca_cola_image.png': coca_cola_image,
  'pepsi_image.png': pepsi_image,
  'sprite_image_1.png': sprite_image_1,
  'fanta_image_1.png': fanta_image_1,
  'basmati_rice_image.png': basmati_rice_image,
  'wheat_flour_image.png': wheat_flour_image,
  'brown_rice_image.png': brown_rice_image,
  'quinoa_image.png': quinoa_image,
  'brown_bread_image.png': brown_bread_image,
  'butter_croissant_image.png': butter_croissant_image,
  'chocolate_cake_image.png': chocolate_cake_image,
  'vanilla_muffins_image.png': vanilla_muffins_image,
  'maggi_image.png': maggi_image,
  'top_ramen_image.png': top_ramen_image,
  'knorr_soup_image.png': knorr_soup_image,
  'yippee_image.png': yippee_image,
};

// Resolve image array — if filename, use local asset; if URL keep as is
const resolveImages = (images) =>
  (images || []).map((img) => LOCAL_IMAGES[img] || img);

const API = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [orders, setOrders] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Restore auth + load products on mount
  useEffect(() => {
    const init = async () => {
      let googleLoggedIn = false;

      // 1. Restore user session from JWT cookie
      if (!googleLoggedIn) {
        try {
          const { data } = await axios.get(`${API}/api/user/check-auth`);
          if (data.success) {
            setUser(data.user);
            if (data.user.cartItems) setCartItems(data.user.cartItems);
          }
        } catch { /* not logged in */ }
      }

      // 2. Restore seller session
      try {
        const { data } = await axios.get(`${API}/api/user/check-seller`);
        if (data.success) setIsSeller(true);
      } catch {
        // No valid sellerToken — clear any stale one
        await axios.post(`${API}/api/user/seller-logout`).catch(() => {});
      }

      setAuthLoading(false);

      // 3. Load products from DB
      try {
        const { data } = await axios.get(`${API}/api/products`);
        if (data.success) setSellerProducts(
          data.products.map((p) => ({ ...p, image: resolveImages(p.image) }))
        );
      } catch { /* use empty */ }
      setProductsLoading(false);
    };
    init();
  }, []);

  // Sync cart to backend when it changes — REMOVED, now using dedicated cart endpoints

  const getCartCount = () =>
    Object.values(cartItems).reduce((total, qty) => total + qty, 0);

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    setToast({ type: 'success', title: 'Added to Cart', message: 'Item added to your cart.' });
    if (user) {
      try { await axios.post(`${API}/api/cart/add`, { itemId }); } catch {}
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId] -= 1;
      else delete updated[itemId];
      return updated;
    });
    if (user) {
      try { await axios.post(`${API}/api/cart/remove`, { itemId }); } catch {}
    }
  };

  const removeItemFromCart = async (itemId) => {
    setCartItems((prev) => { const u = { ...prev }; delete u[itemId]; return u; });
    if (user) {
      try { await axios.delete(`${API}/api/cart/item/${itemId}`); } catch {}
    }
  };

  const clearCart = async () => {
    setCartItems({});
    if (user) {
      try { await axios.delete(`${API}/api/cart`); } catch {}
    }
  };

  const value = {
    user, setUser,
    navigate,
    isSeller, setIsSeller,
    showUserLogin, setShowUserLogin,
    cartItems, setCartItems,
    addToCart, removeFromCart, removeItemFromCart, clearCart, getCartCount,
    orders, setOrders,
    sellerProducts, setSellerProducts,
    productsLoading,
    authLoading,
    toast, setToast,
    currency: import.meta.env.VITE_CURRENCY || '$',
    API,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
