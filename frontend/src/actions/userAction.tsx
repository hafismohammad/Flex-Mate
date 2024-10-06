import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../features/user/userTypes";
import userService from "../services/userServices";
import { useReducer } from "react";

export const registerUser = createAsyncThunk(
  "user/signup",
  async (userDetails: User, thunkAPI) => {
    try {
      const response = await userService.register(userDetails);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

interface VerifyOtpArgs {
  userData: User; 
  otp: string;
}

export const verifyOtp = createAsyncThunk(
  "user/otp",
  async ({ userData, otp }: VerifyOtpArgs, thunkAPI) => {
    try {
      const response = await userService.verifyOtp({ userData, otp });
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

interface loginUser {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: loginUser, thunkAPI) => {
    try {
      const response = await userService.login({ email, password });
      console.log('user login response data', response.data);    
      return response.data; 
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      const response = await userService.logout(); // Call the logout service
      console.log('logout response', response);
      return response.data; // Return the response data from the server
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data); // Handle the error case
    }
  }
)

