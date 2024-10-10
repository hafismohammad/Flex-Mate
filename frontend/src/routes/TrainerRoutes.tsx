import TrainerLoginPage from '../pages/trainer/TrainerLoginPage'
import TrainerSignupPage from '../pages/trainer/TrainerSignupPage'
import TrainerOtpPage from '../pages/trainer/TrainerOtpPage'
import { Route, Router, Routes } from 'react-router-dom'

function TrainerRoutes() {
  return (
    <div>
        <Routes>
            <Route path='/login' element={<TrainerLoginPage />} />
            <Route path='/signup' element={<TrainerSignupPage />} />
            <Route path='/otp' element={<TrainerOtpPage />} />
        </Routes>
    </div>
  )
}

export default TrainerRoutes