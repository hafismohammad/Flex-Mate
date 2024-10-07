import { Routes, Route} from 'react-router-dom'
import AdminLoginPage from '../pages/admin/AdminLoginPage'

function AdminRoutes() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<AdminLoginPage />} />
        </Routes>
    </div>
  )
}

export default AdminRoutes