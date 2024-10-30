import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

function SuccessPayment() {
  const navigate = useNavigate();

  useEffect(() => {
    // You could add a function here to fetch or confirm payment details if needed
  }, []);

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
        
        {/* <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700">Order Summary</h2>
          <p className="text-gray-500 mt-1">Order ID: #123456789</p>
          <p className="text-gray-500 mt-1">Date: {new Date().toLocaleDateString()}</p>
        </div> */}

        <div className="mt-8">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => navigate('#')}
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
