import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { menuItems1 } from "../fooddata";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: {},
    totalAmount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const itemId = action.payload;
      const cart = state.cartItems;
      const updatedCart = { ...cart };
      updatedCart[itemId] = Number(updatedCart[itemId] || 0) + 1;
      state.cartItems = updatedCart;

      const item = menuItems1.find((item) => item.id === itemId);
      state.totalAmount = state.totalAmount + item.price;
    },

    setCart: (state, action) => {
      const cart = { ...state.cartItems };
      const itemId = action.payload.id;
      const quantity = Number(action.payload.quantity);

      let initQuantity = Number(cart[itemId] || 0);
      const updatedCart = { ...cart };
      if (quantity >= 0) updatedCart[itemId] = quantity;
      else delete updatedCart[itemId];
      state.cartItems = updatedCart;

      const item = menuItems1.find((item) => item.id === itemId);

      state.totalAmount =
        state.totalAmount + (quantity - initQuantity) * item.price;
    },
    removeFromCart: (state, action) => {
      const cart = { ...state.cartItems };
      const itemId = action.payload;

      if (cart[itemId] > 0) {
        const updatedCart = { ...cart };
      updatedCart[itemId] = Number(updatedCart[itemId] || 0) - 1;

        if (updatedCart[itemId] === 0) {
          delete updatedCart[itemId];
        }
        // setCart(updatedCart);
        state.cartItems = updatedCart;

        const item = menuItems1.find((item) => item.id === itemId);
        // setTotalAmount((prevTotal) => prevTotal - item.price);
        state.totalAmount = state.totalAmount - item.price;
      }
    },

    clearCart: (state) => {
      state.cartItems = {};
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
