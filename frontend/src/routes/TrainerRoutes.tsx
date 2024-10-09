import React from 'react'
import TrainerLoginPage from '../pages/trainer/TrainerLoginPage'
import TrainerSignupPage from '../pages/trainer/TrainerSignupPage'
import { Route, Router, Routes } from 'react-router-dom'

function TrainerRoutes() {
  return (
    <div>
        <Routes>
            <Route path='/login' element={<TrainerLoginPage />} />
            <Route path='/signup' element={<TrainerSignupPage />} />
        </Routes>
    </div>
  )
}

export default TrainerRoutes