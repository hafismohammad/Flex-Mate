import axios from "axios";
import React, { useEffect, useState } from "react";
import API_URL from "../../../axios/API_URL";

interface User {
  _id: string; 
  name: string; 
  email: string; 
  phone: number; 
  isBlocked: boolean; 
}

function UserListing() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/allUsers`);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter((user) =>
    user._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleBlockUnblock = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/admin/user-block-unblock/${userId}`,
        { status: !currentStatus }
      );
  
      console.log('Server response:', response);
  
      if (response.status === 200 && response.data && response.data.data) {
        const updatedUserStatus = response.data.data.isBlocked;
  
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isBlocked: updatedUserStatus } : user
          )
        );
      } else {
        console.error('Failed to update user status on the server.');
      }
    } catch (error) {
      console.error('Error occurred while updating user status:', error);
    }
  };
  

  


  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-4xl font-bold text-gray-800">User List</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search Users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-7 gap-1 text-lg font-semibold text-gray-600 mb-4 border-b border-gray-200 pb-2">
          <div>ID</div>
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Status</div>
          <div className="col-span-2 text-center">Actions</div>
        </div>

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div 
              key={user._id} 
              className="grid grid-cols-7 items-center p-4 hover:bg-gray-100 transition-colors border-b border-gray-200 last:border-none mb-2"
            >
              <div className="text-gray-800 font-medium">{user._id.toUpperCase().substring(0, 8)}</div>
              <div className="text-gray-800 font-medium">{user.name}</div>
              <div className="text-gray-800 font-medium truncate">{user.email}</div>
              <div className="text-gray-800 font-medium">{user.phone}</div>
              <div className={`${user.isBlocked ? 'font-medium text-red-500': 'font-medium text-green-500' }`}> 
                {user.isBlocked ? "Blocked" : "Active"}
              </div>
              <div className="col-span-2 flex justify-center space-x-4">
                <button
                onClick={() => handleBlockUnblock(user._id, user.isBlocked)} 
                className={`text-white py-2 px-5 rounded-md ${user.isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600' }`}  style={{ minWidth: "100px" }} >
                {user.isBlocked? 'Unblock' :'Block'}  
                </button>
                <button className="text-white py-2 px-5 rounded-md bg-blue-500 hover:bg-blue-600"  style={{ minWidth: "100px" }}>View</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-6">No user found.</div>
        )}
      </div>
    </div>
  );
}

export default UserListing;
