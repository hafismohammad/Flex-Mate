import { createSlice } from "@reduxjs/toolkit"



const initialState = {
    trainerInfo: null,
    trainerToken: null,
    loading: false,
    error: null
}


const trainerSlice = createSlice({
    name: 'trainer',
    initialState,
    reducers: {
        clearTrainer(state) {

        },
        setLoading(state, action) {
            
        },
        setError(state, action) {
            
        }
    }
})

export const {clearTrainer, setError, setLoading } = trainerSlice.actions

export default trainerSlice.reducer