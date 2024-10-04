import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState, User } from './userTypes'; 
import { registerUser, verifyOtp } from "../../actions/userAction";

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
            state.userInfo = null;  
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;  
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;  
        },
    },
    extraReducers: (builder) => {
        builder
            // Register user actions
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {  
                state.loading = false;
                state.userInfo = action.payload;  
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload; 
            })
    
            // Verify OTP actions
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<User>) => {  
                state.loading = false;
                state.userInfo = action.payload;  
                // console.log('userslice OTP---- ', state.userInfo)
                state.error = null;
            })
            .addCase(verifyOtp.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload; 
            });
    }
    
});

// Export actions and reducer
export const { clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
