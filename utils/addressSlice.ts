// store/addressSlice.js

import { createSlice } from '@reduxjs/toolkit';

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
    setAddress: (state:{address : withAddress}, action:any) => {
      state.address = action.payload;
    },
    clearAddress: (state:{address : withAddress}) => {
      state.address = initialState.address; 
    },
  },
});

export const { setAddress, clearAddress } = addressSlice.actions;
export default addressSlice.reducer;
