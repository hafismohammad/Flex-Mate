import { configureStore } from '@reduxjs/toolkit'
import userReduser from '../features/user/userSlice'
import adminReducer from '../features/admin/adminSlice'

// Redux store
const store = configureStore({
    reducer: {
        user: userReduser,
        admin: adminReducer
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>; 
export type AppDispatch = typeof store.dispatch; 