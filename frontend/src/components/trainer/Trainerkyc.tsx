import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { submitKyc } from "../../actions/trainerAction";
import { useSelector } from "react-redux";

const TrainerKyc: React.FC = () => {
  const [documents1, setDocuments1] = useState<File | null>(null);
  const [documents2, setDocuments2] = useState<File | null>(null);
  const [pinCode, setPinCode] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
  });
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  const { trainerToken , trainerInfo} = useSelector((state: RootState) => state.trainer);
  const token = trainerToken;
  const trainer_id = trainerInfo.id

  const dispatch = useDispatch<AppDispatch>();

  

  const handleChange1 = (e: ChangeEvent<HTMLInputElement>) => {
    const file1 = e.target.files?.[0] || null;
    setDocuments1(file1);
  };

  const handleChange2 = (e: ChangeEvent<HTMLInputElement>) => {
    const file2 = e.target.files?.[0] || null;
    setDocuments2(file2);
  };

  const handlePinCodeChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPinCode(value);

    if (value.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${value}`
        );
        const data = await response.json();

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
          setAddress({ street: "", city: "", state: "", country: "" });
        }
      } catch (error) {
        setError("Error fetching address. Please try again.");
        console.error(error);
      }
    } else {
      setAddress({ street: "", city: "", state: "", country: "" });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('trainer_id', trainer_id)
    formData.append("pinCode", pinCode);
    formData.append("address[street]", address.street);
    formData.append("address[city]", address.city);
    formData.append("address[state]", address.state);
    formData.append("address[country]", address.country);
    formData.append("comment", comment);
    
    if (documents1 && documents2) {
      formData.append("document1", documents1);
      formData.append("document2", documents2);
    } else {
      setSubmissionError("Both documents are required.");
      return; 
    }
  
    if (token === null) {
      setSubmissionError("Authorization token is required.");
      return; 
    }
  formData.forEach((item) => {
    console.log('formsubmission', item);
    
  })
    dispatch(submitKyc({ formData, token }));
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">KYC Submission</h1>
      <p className="mb-6 text-center text-gray-600">
        Please fill in the details below to complete your KYC submission.
      </p>

      <form onSubmit={handleSubmit}>
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
                type="text"
                name="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
            <label className="block mb-2">
              Phone Number:
              <input
                type="text"
                name="phone"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
          </div>
        </div>

        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">KYC Document Upload</h2>

          <div className="flex items-center mb-4 space-x-4">
            <h2 className="w-1/4">Aadhar/Driving License</h2>
            <input
              type="file" // Change to "file"
              onChange={handleChange1}
              required
              className="flex-1 border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="flex items-center mb-4 space-x-4">
            <h2 className="w-1/4">Certificate</h2>
            <input
              type="file" // Change to "file"
              onChange={handleChange2}
              required
              className="flex-1 border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Address (Optional)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block mb-2">
              Street Address:
              <input
                type="text"
                name="streetAddress"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
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
                onChange={handlePinCodeChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {error && <p className="text-red-500">{error}</p>}
            </label>
          </div>
        </div>

        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Additional Comments (Optional)
          </h2>
          <textarea
            name="comments"
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows={4}
          ></textarea>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainerKyc;
