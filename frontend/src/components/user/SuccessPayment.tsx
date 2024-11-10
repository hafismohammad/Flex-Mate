import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import userAxiosInstance from '../../../axios/userAxionInstance';

function SuccessPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  const userId = queryParams.get('user_id');
  const stripe_session_id = queryParams.get('stripe_session_id')

  useEffect(() => {
    const createBooking = async () => {
      // Check if the booking has already been created
      const bookingCreated = localStorage.getItem('bookingCreated');

      if (sessionId && userId && !bookingCreated) {
        try {
          console.log('Creating booking...');
          await userAxiosInstance.post('/api/user/createBooking', { sessionId, userId, stripe_session_id });
          console.log('Booking created successfully');
          // Set flag in local storage after successful booking
          localStorage.setItem('bookingCreated', 'true');
        } catch (error) {
          console.error('Error creating booking:', error);
        }
      }
    };

    createBooking();

    // Clean up function to reset the local storage flag when leaving the page
    return () => {
      localStorage.removeItem('bookingCreated');
    };
  }, [sessionId, userId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg text-center">
        <div className="text-green-500 text-7xl flex justify-center animate-jump-in animate-once animate-duration-[2000ms]">
          <FaCheckCircle />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">
          Thank you for your payment. Your transaction has been completed.
        </p>

        <div className="mt-8">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => navigate('/profile/bookings')}
            className="ml-4 bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessPayment;
