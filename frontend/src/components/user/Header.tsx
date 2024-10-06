import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import LOGO from "../../assets/LOGO-2.png";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import ProfileIcon from '../../assets/profile-icon.png'
import {logoutUser} from '../../actions/userAction'

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { userInfo, token } = useSelector((state: RootState) => state.user);


  // Logout handler
  const handleLogout = () => {
    dispatch(logoutUser()); 
    navigate("/login");
  };

  useEffect(() => {
    if(!userInfo) {
      navigate('/login')
    }
  }, [navigate, userInfo])

  return (
    <header className="w-full flex justify-between items-center bg-blue-800 text-white p-4 sticky z-50">
      {/* Logo Section */}
      <div>
        <Link to="/">
          <img src={LOGO} alt="Logo" className="w-max h-7" />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className={`hidden md:flex space-x-8 ${isOpen ? 'block' : ''}`}>
        <ul className="flex space-x-8">
          <li>
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="#" className="hover:text-gray-300">
              About
            </Link>
          </li>
          <li>
            <Link to="#" className="hover:text-gray-300">
              Trainers
            </Link>
          </li>
          <li>
            <Link to="#" className="hover:text-gray-300">
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      {/* Profile Menu */}
      <div className="hidden md:block relative">
        {token ? (
          <div>
            <img
              alt="user profile"
              src={ProfileIcon}
              // src={userInfo?.profilePicture || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"}
              className="h-10 w-10 cursor-pointer rounded-full object-cover"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            />
            {isProfileMenuOpen && (
              <ul
                role="menu"
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white text-gray-800"
              >
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link to="/profile">My Profile</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link to="/edit-profile">Edit Profile</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link to="/inbox">Sessions</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link to="/help">Help</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-white hover:bg-slate-200 text-blue-800 px-4 py-2 rounded"
          >
            Get Started
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
