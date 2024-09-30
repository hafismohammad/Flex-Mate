import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from '../features/user/userTypes';
import userService from "../services/userServices";



export const registerUser = createAsyncThunk(
    'user/signup',
    async (userDetails: User, thunkAPI) => {
        try {
            const response = await userService.register(userDetails)
            return response.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)