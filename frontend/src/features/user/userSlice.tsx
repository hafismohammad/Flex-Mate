import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState, User } from './userTypes'; 
import { registerUser } from "../../actions/userAction";

// Initial state
const initialState: UserState = {
    userInfo: null,
    loading: false, 
    error: null  
}

// User slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
         clearUser(state) {
            state.userInfo = null;  // Clear user information on logout
         },
         setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;  // Set loading state (true or false)
         },
         setError(state, action: PayloadAction<string>) {
            state.error = action.payload;  // Set error message
         },
    },
    extraReducers: (builder) => {
        builder
        // Register User - Pending
        .addCase(registerUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        // Register User - Fulfilled
        .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {  // Ensure PayloadAction<User>
          state.loading = false;
          state.userInfo = action.payload;  // Assign the user data returned from the action
          state.error = null;
        })
        // Register User - Rejected (Optional, if needed)
        .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;  // Set error message
        })
    }
});

// Export actions and reducer
export const { clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
