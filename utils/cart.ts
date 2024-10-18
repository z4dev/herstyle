import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

const initialState: { items: CartItem[], totalPrice: number, totalQuantity: number } = {
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
};

const saveToLocalStorage = (state: typeof initialState) => {
    localStorage.setItem('cart', JSON.stringify(state));
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: { payload: CartItem }) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            state.totalPrice += action.payload.price;
            state.totalQuantity += 1;
            saveToLocalStorage(state);
        },
        removeFromCart: (state, action:{payload:{id:string,price:number , quantity:number}}) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
            state.totalPrice -= action.payload.price * action.payload.quantity;
            state.totalQuantity -= action.payload.quantity;
            saveToLocalStorage(state);
        },
        increaseQuantity: (state, action:{payload:{id:string,price:number}}) => {
            state.items = state.items.map(item => item.id === action.payload.id ? {...item, quantity: item.quantity + 1} : item);
            state.totalPrice += action.payload.price;
            state.totalQuantity += 1;
            saveToLocalStorage(state);
        },
        decreaseQuantity: (state, action:{payload:{id:string,price:number}}) => {
            state.items = state.items.map(item => item.id === action.payload.id ? {...item, quantity: item.quantity - 1} : item);
            state.totalPrice -= action.payload.price;
            state.totalQuantity -= 1;
            saveToLocalStorage(state);
        }
    }
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
