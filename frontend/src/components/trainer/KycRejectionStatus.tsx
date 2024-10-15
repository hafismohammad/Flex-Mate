import React from 'react'

function KycRejectionStatus() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="max-w-2xl p-8 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-3xl font-semibold text-red-500 mb-4">
      Your KYC information has beenBeen Rejected.
      </h1>
      <p className="text-lg text-gray-800 mb-4">
      We regret to inform you that your application has been rejected. 
      </p>
      
     
    </div>
  </div>
  )
}

export default KycRejectionStatus