import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { adminLogin, adminLogout } from '../../actions/adminAction';

interface AdminState {
  adminData: any;
  adminToken: string | null;
  loading: boolean;
  error: string | null;
}

const admin = localStorage.getItem('admin');
const adminData = admin ? JSON.parse(admin) : null;

const initialState: AdminState = {
  adminData: adminData || null,
  adminToken: localStorage.getItem('admin_access_token') || null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login admin cases
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.adminData = action.payload.admin;
        state.adminToken = action.payload.token;
        localStorage.setItem('admin', JSON.stringify(action.payload.admin));
        localStorage.setItem('admin_access_token', action.payload.token);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      })
      // Logout admin case
      .addCase(adminLogout.fulfilled, (state) => {
        state.adminData = null;
        state.adminToken = null;
        state.error = null;
        localStorage.removeItem('admin');
        localStorage.removeItem('admin_access_token');
      });
  },
});

export default adminSlice.reducer;
