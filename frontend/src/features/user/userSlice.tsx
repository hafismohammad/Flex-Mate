import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User, UserState } from './userTypes'; 

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
        // Register User
        // .addCase(registerUser.pending, (state) => {
        //     state.loading = true
        // })
    }
})
