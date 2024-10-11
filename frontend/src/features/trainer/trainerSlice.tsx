import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSpecializations, registerTrainer, trainerVerifyOtp, loginTrainer } from '../../actions/trainerAction';

interface TrainerState {
  trainerInfo: null | any; 
  trainerToken: null | string;
  specializations: any[]; 
  loading: boolean;
  error: null | string;
}

const trainer = localStorage.getItem('trainer')
const parsedTrainer = trainer ? JSON.parse(trainer) : null

const initialState: TrainerState = {
  trainerInfo: parsedTrainer,
  trainerToken: localStorage.getItem('trainer_access_token') || null,
  specializations: [], 
  loading: false,
  error: null,
};

const trainerSlice = createSlice({
  name: 'trainer',
  initialState,
  reducers: {
    clearTrainer(state) {
      state.trainerInfo = null;
      state.trainerToken = null;
      state.specializations = [];
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecializations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecializations.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.specializations = action.payload;         
      })
      .addCase(fetchSpecializations.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch specializations';
      })

      .addCase(registerTrainer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerTrainer.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false
        state.trainerInfo = action.payload;
        state.error = null
      })
      .addCase(registerTrainer.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

        // Verify OTP actions
        .addCase(trainerVerifyOtp.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(trainerVerifyOtp.fulfilled, (state, action: PayloadAction<TrainerState>) => {
          state.loading = false;
          state.trainerInfo = action.payload;
          state.error = null;
        })
        .addCase(trainerVerifyOtp.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        })

         // Login trainer actions
      .addCase(loginTrainer.pending, (state, action: PayloadAction<any>) => {
        state.loading = true;
        state.error = action.payload;
      })
      .addCase(loginTrainer.fulfilled, (state, action) => {
        state.loading = false;
        state.trainerInfo = action.payload.trainer;
        state.trainerToken = action.payload.token;
        
        localStorage.setItem("trainer", JSON.stringify(action.payload.trainer));
        localStorage.setItem("trainer_access_token", action.payload.token);
        // console.log('treiner slice',action.payload.trainer);
      })
      .addCase(loginTrainer.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

// Export the actions and reducer
export const { clearTrainer, setError, setLoading } = trainerSlice.actions;
export default trainerSlice.reducer;
