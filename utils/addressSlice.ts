'use client'
// store/addressSlice.js

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from 'cookies-next';

const initialState = {
  address: {
    firstLine: '',
    googleLocation: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  },
};
type withAddress = {
  firstLine: string,
  googleLocation: string,
  street: string,
  city: string,
  postalCode: string,
  country: string,
}
const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddress: (state:{address : withAddress}, action:PayloadAction<withAddress>) => {
      state.address = action.payload;
      setCookie('address', JSON.stringify(action.payload))
    },
    clearAddress: (state:{address : withAddress}) => {
      state.address = initialState.address; 
      deleteCookie('address')
    },
  },
});

export const { setAddress, clearAddress } = addressSlice.actions;
export default addressSlice.reducer;
