import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { GrMoney } from "react-icons/gr";
import { FaUser } from "react-icons/fa";
// import { FaUser } from "react-icons/fa";
import RevenueChart from "./RevenueChart";
import UserTrainerChart from "./UserTrainerChart";
import adminAxiosInstance from "../../../axios/adminAxiosInstance";

function AdminDashboard() {
  const navigate = useNavigate(); 
  const { adminToken } = useSelector((state: RootState) => state.admin);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalTrainers: 0,
    activeUsers: 0,
    adminRevenue: 0,
    trainerRevenue: 0,
    activeTrainers: 0,
    userTrainerChartData
: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await adminAxiosInstance.get(`/api/admin/dashboardData`); 
        console.log("Dashboard Response:", response.data.data);

        setDashboardData({
          totalRevenue: response.data.data.totalRevenue,
          totalUsers: response.data.data.totalUsers,
          totalTrainers: response.data.data.totalTrainers,
          activeUsers: response.data.data.activeUsers,
          adminRevenue: response.data.data.adminRevenue,
          trainerRevenue: response.data.data.trainerRevenue,  // Corrected here
          activeTrainers: response.data.data.activeTrainers,
          userTrainerChartData: response.data.data.userTrainerChartData,
        });
        
      } catch (error: any) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login'); 
    }
  }, [adminToken, navigate]);
console.log('dashboardData',dashboardData.userTrainerChartData);

  return (
    <div className="flex flex-col p-4  space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
  <div className="bg-gradient-to-br from-green-600 via-green-500 to-green-700 text-white rounded-lg shadow-md p-4 transform hover:scale-102 transition-transform duration-300">
    <div className="flex flex-col justify-center items-start">
      <GrMoney size={40} /> {/* Reduced icon size */}
      <h1 className="text-lg font-medium mt-3">Total Revenue</h1> {/* Reduced font size */}
      <h3 className="text-2xl font-bold mt-2">${dashboardData.totalRevenue}</h3> {/* Reduced font size */}
    </div>
  </div>

  <div className="bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 text-white rounded-lg shadow-md p-4 transform hover:scale-102 transition-transform duration-300">
    <div className="flex flex-col justify-center items-start">
      <FaUser size={40} />
      <h1 className="text-lg font-medium mt-3">Total Users: {dashboardData.totalUsers}</h1>
      <h1 className="text-lg font-medium mt-1">Active Users: {dashboardData.activeUsers}</h1>
    </div>
  </div>

  <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white rounded-lg shadow-md p-4 transform hover:scale-102 transition-transform duration-300">
    <div className="flex flex-col justify-center items-start">
      <FaUser size={40} />
      <h1 className="text-lg font-medium mt-3">Total Trainers: {dashboardData.totalTrainers}</h1>
      <h1 className="text-lg font-medium mt-1">Active Trainers: {dashboardData.activeTrainers}</h1>
    </div>
  </div>
</div>


      <div className="w-[100%] h-[450px] flex space-x-10">
        <div className="w-[50%] bg-white p-10 shadow-lg rounded-lg">
          <RevenueChart data={dashboardData.userTrainerChartData} />
        </div>
        <div className="w-[50%] bg-white p-10 shadow-lg rounded-lg">
          <UserTrainerChart data={dashboardData.userTrainerChartData} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
