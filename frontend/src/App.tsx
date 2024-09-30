import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/user/*" element={<UserRoutes />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
