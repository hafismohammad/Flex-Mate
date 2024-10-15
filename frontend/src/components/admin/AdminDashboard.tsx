import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

function AdminDashboard() {
  const navigate = useNavigate(); 
  const { adminToken } = useSelector((state: RootState) => state.admin);
console.log(adminToken);

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login'); 
    }
  }, [adminToken, navigate]); 

  return (
    <div className="flex-1 p-6 bg-gray-100">
      <h2 className="text-3xl font-semibold">Welcome to the Admin Dashboard!</h2>
    </div>
  );
}

export default AdminDashboard;
