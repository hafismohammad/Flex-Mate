import React, { useState, useEffect } from "react";
import TrainerSidebar from "./TrainerSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { BsBell } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { logoutTrainer } from "../../actions/trainerAction";
import axiosInstance from "../../../axios/trainerAxiosInstance";

interface Notification {
  content: string;
  read: boolean;
  createdAt: string;
}

const TrainerLayout: React.FC = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { trainerInfo } = useSelector((state: RootState) => state.trainer);

  // Logout handler
  const handleLogout = () => {
    dispatch(logoutTrainer());
    navigate("/trainer/login");
  };

  // Toggle dropdowns
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (trainerInfo?.id) {
          const response = await axiosInstance.get(
            `/api/trainer/notifications/${trainerInfo.id}`
          );
          setNotifications(response.data.notifications || []);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, [trainerInfo?.id]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <TrainerSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="bg-blue-800 text-white shadow-md py-4 px-6 flex items-center justify-between">
          <div className="relative flex items-center space-x-6 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <BsBell
                className="h-6 w-6 text-white cursor-pointer"
                onClick={toggleNotificationDropdown}
              />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
                {notifications.length}
              </span>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute top-10 right-0 w-80 bg-white shadow-lg rounded-md p-4 z-10">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Notifications
                  </h3>
                  {notifications.length > 0 ? (
                    <ul className="space-y-3 mt-2 max-h-64 overflow-y-auto">
                      {notifications.map((notification, index) => (
                        <li
                          key={index}
                          className={`text-sm text-gray-700 border-b pb-2 ${
                            notification.read ? "opacity-50" : ""
                          }`}
                        >
                          {notification.content}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No new notifications
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                className="flex items-center focus:outline-none"
                onClick={toggleProfileDropdown}
              >
                <FaUserCircle className="text-2xl" />
              </button>
              {isProfileDropdownOpen && (
                <ul
                  role="menu"
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white text-gray-800 z-10"
                >
                  <li className="px-4 py-2 hover:bg-gray-100">
                    <button
                      onClick={() => navigate("/trainer/profile")}
                      className="w-full text-left"
                    >
                      My Profile
                    </button>
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 p-4 bg-blue-50 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TrainerLayout;
