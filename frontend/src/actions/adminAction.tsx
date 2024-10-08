import { createAsyncThunk } from "@reduxjs/toolkit";
import AdminService from '../services/AdminService'

interface loginAdmin {
    email: string;
    password: string;
  }
export const adminLogin = createAsyncThunk(
    'admin/login',
    async ({email, password}: loginAdmin, thunkAPI) => {

        
        try {
            const response = await AdminService.adminLogin({email, password})
            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)