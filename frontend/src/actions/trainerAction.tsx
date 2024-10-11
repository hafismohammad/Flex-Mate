import { createAsyncThunk } from "@reduxjs/toolkit";
import trainerService from '../services/TrainerService';
import { error } from "console";

export const fetchSpecializations = createAsyncThunk<any[], void>(
  'trainer/fetchSpecializations',
  async (_, thunkAPI) => {
    try {
      const response = await trainerService.getAllSpecializations();
      return response.data;
    } catch (error: any) {
      // Return a structured error object with a message
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch specializations');
    }
  }
);

export interface ITrainer {
  trainerId?: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  specialization: string
  isBlocked?: boolean;
}

export const registerTrainer = createAsyncThunk(
  'trainer/signup',
  async (trainerData: ITrainer, thunkAPI) => {
    try {
      const response = await trainerService.registerTrainer(trainerData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const trainerVerifyOtp = createAsyncThunk(
  'trainer/otp',
  async ({ trainerData, otp }: { trainerData: ITrainer; otp: string }, thunkAPI) => {
    try {
      const response = await trainerService.verifyOtp({ trainerData, otp });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

interface loginTrainer {
  email: string;
  password: string;
}

export const loginTrainer = createAsyncThunk(
  'trainer/login',
  async ({ email, password }: loginTrainer, thunkAPI) => {
    try {
      const response = await trainerService.trainerLogin({ email, password });
      console.log('Trainer login response data', response.data);    
      return response.data; 
      
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);