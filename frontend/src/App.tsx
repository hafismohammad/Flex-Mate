import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import TrainerRoutes from './routes/TrainerRoutes';
import './App.css'
import { RootState } from './app/store';
import { useSelector } from 'react-redux';
import OutgoingVideocallPage from './pages/trainer/OutgoingVideocallPage';
import IncomingVideocallPage from './pages/user/IncomingVideocallPage';
import TrainerVideoCall from './components/trainer/VideoCall';
import VideoCall from './components/user/VideoCall';

const App: React.FC = () => {
  const {videoCall, showVideoCallTrainer} = useSelector((state: RootState) => state.trainer)
  const {showIncomingVideoCall, showVideoCallUser} = useSelector((state: RootState) => state.user)

console.log('vt', showIncomingVideoCall);

  
  return (
    <>
      <Router>
          {videoCall && <OutgoingVideocallPage />}
          {showIncomingVideoCall?._id && <IncomingVideocallPage />}
          {showVideoCallTrainer && <TrainerVideoCall />}
          {showVideoCallUser && <VideoCall />}
        <Routes>          
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/trainer/*" element={<TrainerRoutes />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
