import { createSlice } from "@reduxjs/toolkit";


const initialState: { name: string | null } = {
    name: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // New reducer to add a name
        addName: (state, action: { payload: string }) => {
            state.name = action.payload;
        },
        // New reducer to delete the name
        deleteName: (state) => {
            state.name = null;
        },
    }
});

export const { addName, deleteName } = userSlice.actions;
export default userSlice.reducer;

