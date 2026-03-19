import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const itemKey = (item: Pick<CartItem, "id" | "selectedSize" | "selectedColor">) =>
  `${item.id}||${item.selectedSize ?? ""}||${item.selectedColor ?? ""}`;

const loadFromStorage = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem("redux_cart") || "[]");
  } catch {
    return [];
  }
};

const saveToStorage = (items: CartItem[]) => {
  localStorage.setItem("redux_cart", JSON.stringify(items));
};

const initialState: CartState = {
  items: loadFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const k = itemKey(action.payload);
      const existing = state.items.find((i) => itemKey(i) === k);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveToStorage(state.items);
    },

    removeFromCart(
      state,
      action: PayloadAction<{ id: number; selectedSize?: string; selectedColor?: string }>
    ) {
      const k = itemKey(action.payload);
      state.items = state.items.filter((i) => itemKey(i) !== k);
      saveToStorage(state.items);
    },

    updateQuantity(
      state,
      action: PayloadAction<{
        id: number;
        quantity: number;
        selectedSize?: string;
        selectedColor?: string;
      }>
    ) {
      const { quantity, ...rest } = action.payload;
      const k = itemKey(rest);
      if (quantity <= 0) {
        state.items = state.items.filter((i) => itemKey(i) !== k);
      } else {
        const item = state.items.find((i) => itemKey(i) === k);
        if (item) item.quantity = quantity;
      }
      saveToStorage(state.items);
    },

    clearCart(state) {
      state.items = [];
      saveToStorage([]);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;