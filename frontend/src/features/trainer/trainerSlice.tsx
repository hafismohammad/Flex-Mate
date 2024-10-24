import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchSpecializations,
  registerTrainer,
  trainerVerifyOtp,
  loginTrainer,
  logoutTrainer,
  getKycStatus,
  submitKyc
} from "../../actions/trainerAction";

interface TrainerState {
  trainerInfo: null | any;
  trainerToken: null | string;
  specializations: any[];
  kycStatus: string;
  loading: boolean;
  rejectionReason: null | string;
  error: null | string;
}

const trainer = localStorage.getItem("trainer");
const parsedTrainer = trainer ? JSON.parse(trainer) : null;

const initialState: TrainerState = {
  trainerInfo: parsedTrainer,
  trainerToken: localStorage.getItem("trainer_access_token") || null,
  specializations: [],
  kycStatus: "pending",
  rejectionReason: null,
  loading: false,
  error: null,
};

const trainerSlice = createSlice({
  name: "trainer",
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
      .addCase(
        fetchSpecializations.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.loading = false;
          state.specializations = action.payload;
        }
      )
      .addCase(fetchSpecializations.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // console.log('-------------------',action.payload);
        state.error = action.payload?.message || "Failed to fetch specializations";
      })

      .addCase(registerTrainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerTrainer.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.trainerInfo = action.payload;
        
        state.error = null; 
      })
      .addCase(registerTrainer.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error =  action.payload || "Registration failed"
        console.log('acion',action.payload);
      })  
      
      // Verify OTP actions
      .addCase(trainerVerifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(trainerVerifyOtp.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.trainerInfo = action.payload;
        state.error = null;
      })
      .addCase(trainerVerifyOtp.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      })

      // Login trainer actions
      .addCase(loginTrainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginTrainer.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.trainerInfo = action.payload.trainer;
        state.trainerToken = action.payload.token;
        localStorage.setItem("trainer", JSON.stringify(action.payload.trainer));
        localStorage.setItem("trainer_access_token", action.payload.token);
      })
      .addCase(loginTrainer.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // Logout trainer
      .addCase(logoutTrainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutTrainer.fulfilled, (state) => {
        state.loading = false;
        state.trainerInfo = null;
        state.trainerToken = null;
        localStorage.removeItem("trainer");
        localStorage.removeItem("trainer_access_token");
      })
      // kyc status update
      .addCase(getKycStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKycStatus.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.kycStatus = action.payload.kycStatus;
        console.log('get kyc',action.payload.kycStatus);
        
        state.error = null;
      })
      .addCase(getKycStatus.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      })

      // kuc submit then change kycStatus to submited
      .addCase(submitKyc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitKyc.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.kycStatus = action.payload.kycStatus;
        console.log('submitt kyc',action.payload.kycStatus);
        
        state.error = null;
      })
      .addCase(submitKyc.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      })
  },
});

// Export the actions and reducer
export const { clearTrainer, setError, setLoading } = trainerSlice.actions;
export default trainerSlice.reducer;
