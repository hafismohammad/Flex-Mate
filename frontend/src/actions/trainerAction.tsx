import { createAsyncThunk } from "@reduxjs/toolkit";
import trainerService from '../services/TrainerService';

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