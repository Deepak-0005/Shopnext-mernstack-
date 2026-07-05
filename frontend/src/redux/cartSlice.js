import { createSlice } from '@reduxjs/toolkit';

const getCartStorageKey = (user = null) => {
  const currentUser = user || JSON.parse(localStorage.getItem('userInfo') || 'null');
  const userId = currentUser?._id || currentUser?.id || currentUser?.email || 'guest';
  return `cartItems:${userId}`;
};

const loadCartItems = (user = null) => {
  const key = getCartStorageKey(user);
  const stored = localStorage.getItem(key);

  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  const legacyCart = localStorage.getItem('cartItems');
  if (legacyCart) {
    try {
      const parsed = JSON.parse(legacyCart);
      localStorage.setItem(key, JSON.stringify(parsed));
      localStorage.removeItem('cartItems');
      return parsed;
    } catch {
      localStorage.removeItem('cartItems');
    }
  }

  return [];
};

const persistCartItems = (items, user = null) => {
  const key = getCartStorageKey(user);
  localStorage.setItem(key, JSON.stringify(items));
  localStorage.removeItem('cartItems');
};

const initialState = {
  cartItems: loadCartItems()
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    syncCartForUser: (state, action) => {
      const user = action.payload || null;
      state.cartItems = loadCartItems(user);
    },

    addToCart: (state, action) => {
      const item = action.payload;
      const itemId = item._id || item.productId;
      const currentUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
      const existItem = state.cartItems.find((x) => (x._id || x.productId) === itemId);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) => (x._id || x.productId) === itemId ? { ...x, ...item, qty: item.qty ?? x.qty } : x);
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      persistCartItems(state.cartItems, currentUser);
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const currentUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
      state.cartItems = state.cartItems.filter((x) => (x._id || x.productId) !== itemId);

      persistCartItems(state.cartItems, currentUser);
    },

    clearCart: (state) => {
      const currentUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
      state.cartItems = [];
      persistCartItems(state.cartItems, currentUser);
    }
  }
});

export const { syncCartForUser, addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;