import { Routes, Route } from 'react-router-dom';
import SignupPage from '../pages/user/SignupPage';

function UserRoutes() {
  return (
    <div>
      <Routes>
        <Route path='/signup' element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default UserRoutes;
