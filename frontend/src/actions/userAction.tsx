import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../features/user/userTypes";
import userService from "../services/userServices";
import Otp from "../components/user/Otp";

export const registerUser = createAsyncThunk(
  "user/signup",
  async (userDetails: User, thunkAPI) => {
    try {
      // console.log('createAsyncThunk registerUser');
      const response = await userService.register(userDetails);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

interface VerifyOtpArgs {
  userData: User; // Complete user details
  otp: string;
}

export const verifyOtp = createAsyncThunk(
  "user/otp",
  async ({ userData, otp }: VerifyOtpArgs, thunkAPI) => {
    try {
      console.log("createAsyncThunk", userData, otp);

      const response = await userService.verifyOtp({ userData, otp });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
