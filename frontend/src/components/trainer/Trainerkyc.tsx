import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { submitKyc } from "../../actions/trainerAction";
import { useNavigate } from "react-router-dom";

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
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    documents: "",
  });

  const { trainerToken, trainerInfo } = useSelector((state: RootState) => state.trainer);
  const token = trainerToken;
  const trainer_id = trainerInfo.id;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleFileChange1 = (e: ChangeEvent<HTMLInputElement>) => {
    setDocuments1(e.target.files?.[0] || null);
  };

  const handleFileChange2 = (e: ChangeEvent<HTMLInputElement>) => {
    setDocuments2(e.target.files?.[0] || null);
  };

  const handlePinCodeChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPinCode(value);

    if (value.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
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

  const validate = () => {
    const errors = {
      name: "",
      email: "",
      phone: "",
      documents: "",
    };

    // Validate name
    const name = document.querySelector('input[name="name"]') as HTMLInputElement;
    if (!name.value.trim()) {
      errors.name = "Name is required.";
    }

    // Validate email
    const email = document.querySelector('input[name="email"]') as HTMLInputElement;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(email.value)) {
      errors.email = "Please enter a valid email address.";
    }

    // Validate phone
    const phone = document.querySelector('input[name="phone"]') as HTMLInputElement;
    if (!phone.value.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phone.value.trim())) {
      errors.phone = "Phone number must be 10 digits.";
    }

    // Validate document uploads
    if (!documents1) {
      errors.documents = "Please upload your Aadhar/Driving License.";
    }
    if (!documents2) {
      errors.documents = "Please upload your Certificate.";
    }

    setFormErrors(errors);
    return Object.values(errors).every((error) => error === "");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Reset submission error on new submission attempt
    setSubmissionError("");

    // Validate before proceeding
    if (!validate()) {
      return; // Stop submission if there are errors
    }

    const formData = new FormData();
    formData.append("trainer_id", trainer_id);
    formData.append("specialization_id", trainerInfo.specialization);
    formData.append("pinCode", pinCode);
    formData.append("address[street]", address.street);
    formData.append("address[city]", address.city);
    formData.append("address[state]", address.state);
    formData.append("address[country]", address.country);
    formData.append("comment", comment);

    if (documents1) {
      formData.append("document1", documents1);
    }
    if (documents2) {
      formData.append("document2", documents2);
    }

    if (!token) {
      setSubmissionError("Authorization token is required.");
      return;
    }

    // Dispatch the action to submit KYC
    await dispatch(submitKyc({ formData, token }));
    navigate("/trainer");
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
              {formErrors.name && <p className="text-red-500">{formErrors.name}</p>}
            </label>
            <label className="block mb-2">
              Email:
              <input
                type="text"
                name="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
            </label>
            <label className="block mb-2">
              Phone Number:
              <input
                type="text"
                name="phone"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {formErrors.phone && <p className="text-red-500">{formErrors.phone}</p>}
            </label>
          </div>
        </div>

        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">KYC Document Upload</h2>

          <div className="flex items-center mb-4 space-x-4">
            <h2 className="w-1/4">Aadhar/Driving License</h2>
            <input
              type="file"
              onChange={handleFileChange1}
              required
              className="flex-1 border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="flex items-center mb-4 space-x-4">
            <h2 className="w-1/4">Certificate</h2>
            <input
              type="file"
              onChange={handleFileChange2}
              required
              className="flex-1 border border-gray-300 rounded-md p-2"
            />
          </div>
          {formErrors.documents && <p className="text-red-500">{formErrors.documents}</p>}
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
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
            <label className="block mb-2">
              State:
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
            <label className="block mb-2">
              Country:
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
          </div>

          <label className="block mb-2">
            PIN Code:
            <input
              type="text"
              value={pinCode}
              onChange={handlePinCodeChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            {error && <p className="text-red-500">{error}</p>}
          </label>

          <label className="block mb-2">
            Comment:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 rounded-md shadow hover:bg-blue-700"
        >
          Submit KYC
        </button>
        {submissionError && <p className="text-red-500">{submissionError}</p>}
      </form>
    </div>
  );
};

export default TrainerKyc;
