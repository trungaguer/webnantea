import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ================= ADD TO CART =================
    addToCart: (state, action) => {
      const p = action.payload;

      // 🔥 NORMALIZE PRODUCT (FIX id/_id BUG)
      const product = {
        _id: p?._id || p?.id,
        name: p?.name,
        price: p?.price,
        discount: p?.discount || 0,
        image: p?.image,
        countInStock: p?.countInStock || 0,
      };

      // ❌ VALIDATION
      if (!product._id) {
        console.warn("❌ INVALID PRODUCT ADD TO CART:", p);
        return;
      }

      const item = state.cartItems.find((i) => i.product?._id === product._id);

      const amount = Math.max(Number(p?.amount || 1), 1); // 🔥 FIX CHÍNH

      if (item) {
        item.amount += amount; // 🔥 FIX: dùng amount từ FE
      } else {
        state.cartItems.push({
          product,
          amount: amount, // 🔥 FIX
        });
      }
    },

    // ================= REMOVE =================
    removeFromCart: (state, action) => {
      const id = action.payload;

      state.cartItems = state.cartItems.filter(
        (i) => i.product?._id !== id && i.product?.id !== id,
      );
    },

    // ================= INCREASE =================
    increaseAmount: (state, action) => {
      const id = action.payload;

      const item = state.cartItems.find(
        (i) => i.product?._id === id || i.product?.id === id,
      );

      if (item) item.amount += 1;
    },

    // ================= DECREASE =================
    decreaseAmount: (state, action) => {
      const id = action.payload;

      const item = state.cartItems.find(
        (i) => i.product?._id === id || i.product?.id === id,
      );

      if (!item) return;

      item.amount -= 1;

      if (item.amount <= 0) {
        state.cartItems = state.cartItems.filter(
          (i) => i.product?._id !== id && i.product?.id !== id,
        );
      }
    },

    // ================= UPDATE AMOUNT =================
    updateAmount: (state, action) => {
      const { id, amount } = action.payload;

      const item = state.cartItems.find(
        (i) => i.product?._id === id || i.product?.id === id,
      );

      if (item) {
        item.amount = Math.max(Number(amount || 1), 1);
      }
    },

    // ================= CLEAR CART =================
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseAmount,
  decreaseAmount,
  updateAmount,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
