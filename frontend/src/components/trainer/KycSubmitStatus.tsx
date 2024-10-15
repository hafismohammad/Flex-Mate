

function KycSubmitStatus() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-2xl p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-semibold text-green-500 mb-4">
        Your KYC information has been submitted successfully.
        </h1>
        <p className="text-lg text-gray-800 mb-4">
          Thank you for submitting your KYC information. Your details are currently under review by our admin team.
        </p>
        
       
      </div>
    </div>
  );
}

export default KycSubmitStatus;
