import React, { useState, ChangeEvent, FormEvent } from "react";

// Define the type for documents
interface Document {
  type: string;
  file: File | null;
}

const TrainerKyc: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    { type: "", file: null },
    { type: "", file: null },
  ]);
  const [pinCode, setPinCode] = useState(""); // State for PIN code
  const [address, setAddress] = useState({ street: "", city: "", state: "", country: "" });
  const [error, setError] = useState("");

  const handleDocumentChange = (index: number, event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const newDocuments = [...documents];

    if (event.target instanceof HTMLInputElement) {
      // Check if the target is an input element and has files
      if (event.target.files) {
        newDocuments[index].file = event.target.files[0]; // Update the file if it's an input change
      }
    } else {
      // It's a select element
      newDocuments[index].type = event.target.value; // Update the type if it's a select change
    }

    setDocuments(newDocuments);
  };

  const handlePinCodeChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPinCode(value);

    // Fetch address based on PIN code if it's a valid length
    if (value.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await response.json();

        // Check if the data is valid
        if (data[0].Status === "Success") {
          const addressData = data[0].PostOffice[0];
          setAddress({
            street: "", 
            city: addressData.District,
            state: addressData.State,
            country: "India",
          });
          setError("");
        } else {
          setError("Invalid PIN code. Please try again.");
          setAddress({ street: "", city: "", state: "", country: "" }); // Reset address
        }
      } catch (error) {
        setError("Error fetching address. Please try again.");
        console.error(error);
      }
    } else {
      setAddress({ street: "", city: "", state: "", country: "" }); // Reset address if PIN code is not valid length
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log({ documents, pinCode, address }); // You can send this to your backend or handle it as required
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">KYC Submission</h1>
      <p className="mb-6 text-center text-gray-600">
        Please fill in the details below to complete your KYC submission.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block mb-2">
              Name:
              <input
                type="text"
                name="name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
            <label className="block mb-2">
              Email:
              <input
                type="email"
                name="email"
                value="trainer@example.com"
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
              />
            </label>
            <label className="block mb-2">
              Phone Number:
              <input
                type="tel"
                name="phone"
                value="+1234567890"
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
              />
            </label>
          </div>
        </div>

        {/* KYC Document Upload Section */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">KYC Document Upload</h2>
          {documents.map((document, index) => (
            <div key={index} className="flex items-center mb-4 space-x-4">
              <select
                value={document.type}
                onChange={(e) => handleDocumentChange(index, e)}
                className="flex-1 border border-gray-300 rounded-md p-2"
              >
                <option value="">Select Document Type</option>
                <option value="aadhar">Aadhar</option>
                <option value="passport">Passport</option>
                <option value="drivingLicense">Driving License</option>
                <option value="certificate">Certificate</option> {/* New option for Certificate */}
              </select>
              <input
                type="file"
                required
                onChange={(e) => handleDocumentChange(index, e)}
                className="flex-1 border border-gray-300 rounded-md p-2"
              />
            </div>
          ))}
        </div>

        {/* Address Section */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Address (Optional)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block mb-2">
              Street Address:
              <input
                type="text"
                name="streetAddress"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
            <label className="block mb-2">
              City:
              <input
                type="text"
                name="city"
                value={address.city}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
              />
            </label>
            <label className="block mb-2">
              State:
              <input
                type="text"
                name="state"
                value={address.state}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
              />
            </label>
            <label className="block mb-2">
              PIN Code:
              <input
                type="text"
                name="pinCode"
                value={pinCode}
                onChange={handlePinCodeChange} // Update PIN code on input change
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {error && <p className="text-red-500">{error}</p>}
            </label>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Additional Comments (Optional)</h2>
          <textarea
            name="comments"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows={4}
          ></textarea>
        </div>

        {/* Submission Section */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition "
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainerKyc;
