import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { adminLogin } from '../../actions/adminAction';

interface AdminState {
  adminData: any;
  adminToken: string| null
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  adminData: null,
  adminToken: localStorage.getItem("access_token") || null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.adminData = action.payload.admin
        state.adminToken = action.payload.token
        localStorage.setItem("admin", JSON.stringify(action.payload.admin));
        localStorage.setItem("access_token", action.payload.token);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default adminSlice.reducer;
