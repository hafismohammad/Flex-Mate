import { useParams } from "react-router-dom";
import profileBG from "../../assets/trainer-profile-view-img.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../axios/API_URL";
import { TrainerProfile } from "../../types/trainer";
import LOGO from "../../assets/LOGO-2.png";
import DatePicker from "react-datepicker";
import { ISessionSchedule } from "../../types/common";
import {
  formatPriceToINR,
  numberOfSessions,
} from "../../utils/timeAndPriceUtils";
import { AiOutlineClose } from "react-icons/ai";
import userAxiosInstance from "../../../axios/userAxionInstance";

function TrainerProfileView() {
  const [trainer, setTrainer] = useState<TrainerProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSingleSession, setIsSingleSession] = useState(true);
  const [sessionSchedules, setSessionSchedules] = useState<ISessionSchedule[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { trainerId } = useParams();

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await userAxiosInstance.get(
          `/api/user/getTrainer/${trainerId}`
        );
        setTrainer(response.data[0]);
      } catch (error) {
        console.error("Error fetching trainer:", error);
      }
    };

    fetchTrainer();
  }, [trainerId]);

  const handleBooking = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSingleSession = () => {
    setIsSingleSession(true);
  };

  const handlePackageSession = () => {
    setIsSingleSession(false);
  };

  useEffect(() => {
    const fetchSeessionSchedules = async () => {
      const response = await userAxiosInstance.get(`/api/user/sessionSchedules`);
      // console.log(response.data);
      setSessionSchedules(response.data);
    };
    fetchSeessionSchedules();
  }, []);

  const sessionDates = Array.from(
    new Set(
      sessionSchedules
        .filter(
          (session) =>
            session.trainerId === trainerId &&
            session.isSingleSession === isSingleSession
        )
        .map((session) => new Date(session.startDate).toDateString())
    )
  ).map((dateStr) => new Date(dateStr));

  return (
    <div className="mb-40">
      <div>
        <img
          className="w-full h-[37vh]"
          src={profileBG}
          alt="Profile Background"
        />
      </div>
      <div className="absolute top-36 md:top-40 left-8 md:left-32 flex items-center justify-center">
        <img
          src={trainer?.profileImage}
          alt="Profile"
          className="w-52 h-52 rounded-full bg-slate-500 object-cover border-4 border-white shadow-lg"
        />
        <div className="flex flex-col ml-10 ">
          <h1 className="text-4xl font-bold  mt-40  rounded-lg">
            {trainer?.name}
          </h1>
          <h2 className="text-xl font-medium text-gray-700 mt-2">
            {trainer?.specialization.name}
          </h2>
        </div>
      </div>
      <div className="mt-36 mx-8 md:mx-auto border-b-2 border-gray-300"></div>
      <div className="flex justify-normal ">
        <div className="mx-8 md:mx-auto mt-8 md:ml-36 ">
          {/* <h1 className="text-2xl font-medium text-gray-500">
          {trainer?.yearsOfExperience || ''}
        </h1> */}
          <div>
            <h1 className="text-6xl font-semibold">5.0</h1>
          </div>
          <div className="flex justify-start  mt-2">
            <div className="text-blue-500 text-3xl">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
            <h2 className="ml-2 text-blue-500 text-2xl">2 reviews</h2>
          </div>
          <button className="bg-gradient-to-b from-blue-500 to-blue-500 text-white font-bold py-2 px-4 w-64 mt-7  rounded-2xl shadow-md ">
            Book Session
          </button>
        </div>
        <div className="bg-blue-50 rounded-md p-10 mt-10 ml-10 mr-36">
          <h1 className="text-3xl font-semibold mb-7">About {trainer?.name}</h1>
          <p className="font-normal">
            Trainer1 is a passionate yoga and Pilates trainer, dedicated to
            fostering connections and friendships through movement. Hailing from
            Jeffreys Bay, known as the surf capital of the world, he embraces
            the beauty of nature and the joy of surfing, spending his days
            riding waves and enjoying the camaraderie of fellow surfers. With a
            background as a former mixed martial artist, Eddie brings a unique
            perspective to his training, blending strength and flexibility. He
            is an open-minded individual who values kindness and compassion,
            aiming to create a welcoming environment for all. As an animal and
            nature lover, Eddie believes in sharing positivity and nurturing a
            sense of community within his classes. Whether guiding a yoga
            session or a Pilates workout, Eddie’s enthusiasm shines through,
            inspiring others to explore their potential while cultivating a
            sense of well-being. Join him on this journey of movement,
            mindfulness, and connection
          </p>
          <p className="mt-5 font-medium">Languages: {trainer?.language}</p>
        </div>
      </div>
      <div className="bg-blue-500 h-[150vh] mt-20">
        <div className="flex justify-between items-center p-10">
          <img src={LOGO} alt="logo" className="w-80 h-20" />

          <DatePicker
            minDate={new Date()}
            selected={selectedDate}
            inline
            highlightDates={sessionDates}
            onChange={(date) => setSelectedDate(date)}
            className="h-80 w-80 border border-gray-300 rounded-lg shadow-lg p-2"
          />
        </div>
        <div className="flex justify-center">
          <div className=" border-b-2 border-b-black w-96 mr-10"></div>
          <h1 className="font-semibold">
            {selectedDate
              ? selectedDate?.toDateString()
              : new Date().toDateString()}
          </h1>
          <div className=" border-b-2 border-b-black w-96 ml-10"></div>
        </div>
        <div className="flex justify-center mt-20">
          <div className="bg-blue-50 rounded-md shadow-lg p-6 w-[80%] h-[75vh]">
            <div className="mt-5 space-x-4 flex justify-center">
              <button
                onClick={handleSingleSession}
                className={`${
                  isSingleSession
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-500 hover:bg-gray-600"
                } text-white px-4 py-3 shadow-md`}
              >
                Single Session
              </button>
              <button
                onClick={handlePackageSession}
                className={`${
                  isSingleSession
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white px-4 py-3 shadow-md`}
              >
                Package Sessions
              </button>
            </div>

            <div className="p-5 mt-8">
              {sessionSchedules.filter(
                (session) =>
                  session.isSingleSession === isSingleSession &&
                  session.trainerId === trainerId
              ).length === 0 ? (
                <div className="flex justify-center">
                  <h1 className="text-black">
                    {isSingleSession
                      ? "No Single Sessions available."
                      : "No Packages available."}
                  </h1>
                </div>
              ) : (
                sessionSchedules
                  .filter((session) => {
                    const sessionDate = new Date(
                      session.startDate
                    ).toLocaleDateString();
                    const selectedDateStr = selectedDate
                      ? selectedDate.toLocaleDateString()
                      : null;
                    return (
                      session.isSingleSession === isSingleSession &&
                      session.trainerId === trainerId &&
                      sessionDate === selectedDateStr
                    );
                  })
                  .map((session) => (
                    <div key={session._id} className="mb-8">
                      <div className="flex justify-between items-center">
                        <div>
                          <h1 className="font-medium text-2xl">
                            Time: {session.startTime} - {session.endTime}
                          </h1>
                          {!isSingleSession && (
                            <h1 className="font-medium text-2xl mt-2">
                              Number of Sessions:{" "}
                              {numberOfSessions(
                                session.startDate,
                                session.endDate
                              )}
                            </h1>
                          )}
                        </div>

                        <div className="h-10 w-px bg-gray-300 mx-5"></div>

                        <div className="flex items-center space-x-4">
                          <div>
                            <h1 className="font-medium text-2xl">
                              Price: {formatPriceToINR(session.price)}
                            </h1>
                            {!isSingleSession && (
                              <h1 className="text-gray-600">
                                {new Date(
                                  session.startDate
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(session.endDate).toLocaleDateString()}
                              </h1>
                            )}
                          </div>
                          <button
                            onClick={handleBooking}
                            className="bg-blue-500 hover:bg-blue-600 px-4 py-3 text-white"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-center mt-4">
                        <div className="border-b-2 border-b-gray-300 w-full"></div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout modal  */}

      {isModalOpen ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 md:p-8 w-full max-w-2xl shadow-lg h-[85vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl focus:outline-none"
              onClick={closeModal}
            >
              <AiOutlineClose />
            </button>

            <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Confirm Your Booking
            </h1>
            <p className="text-center text-gray-500 mb-8">
              Review your booking details below before proceeding to payment.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg shadow-inner mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700">
                    Trainer Name
                  </label>
                  <p className="text-gray-900">Trainer1</p>
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700">
                    Date and Time
                  </label>
                  <p className="text-gray-900">Date: 11/11/2024</p>
                  <p className="text-gray-900">Time: 7:00 AM - 8:00 AM</p>
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700">
                    Duration
                  </label>
                  <p className="text-gray-900">1 hour</p>
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold text-gray-700">
                    Payment Summary
                  </label>
                  <p className="text-gray-900">Session Cost: ₹10,000.00</p>
                  <p className="text-gray-900">Service Fee: ₹500.00</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg shadow mb-8 text-center">
              <label className="font-semibold text-lg text-blue-700">
                Total Cost
              </label>
              <p className="text-2xl font-bold text-blue-900">₹10,500.00</p>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors duration-200 shadow-md">
              Proceed to Payment
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TrainerProfileView;
