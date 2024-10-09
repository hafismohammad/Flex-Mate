import { createAsyncThunk } from "@reduxjs/toolkit";
import AdminService from "../services/AdminService";

interface loginAdmin {
  email: string;
  password: string;
}
export const adminLogin = createAsyncThunk(
  "admin/login",
  async ({ email, password }: loginAdmin, thunkAPI) => {
    try {
      const response = await AdminService.adminLogin({ email, password });
      console.log('admin login response', response.data);
      
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const adminLogout = createAsyncThunk(
    'admin/logout',
    async (_, thunkAPI) => {
        try {
            const response = await AdminService.adminLogout()
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)
