import { createAsyncThunk } from "@reduxjs/toolkit";
import AdminService from "../services/AdminService";
import adminService from "../services/AdminService";

interface LoginAdmin {
  email: string;
  password: string;
}

export const adminLogin = createAsyncThunk(
  "admin/login",
  async ({ email, password }: LoginAdmin, thunkAPI) => {
    try {
      const response = await AdminService.adminLogin({ email, password });
      console.log("admin login response", response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to login");
    }
  }
);

export const adminLogout = createAsyncThunk(
  "admin/logout",
  async (_, thunkAPI) => {
    try {
      const response = await AdminService.adminLogout();
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to logout");
    }
  }
);

export const addSpecialization = createAsyncThunk(
  "admin/addSpecialization",
  async ({ name, description }: { name: string; description: string }, thunkAPI) => {
    try {
      const response = await AdminService.addSpecialization({ name, description });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Failed to add specialization");
    }
  }
);

export const fetchAllSpecializations = createAsyncThunk(
  'admin/getAllSpecialization',
  async (_, thunkAPI) => {
    try {      
      const response = await AdminService.getAllSpecializaton()
      // console.log(response.data,'dfdf');
      
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data)
    }
  }
)
