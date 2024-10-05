import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import LOGO from '../../assets/LOGO-2.png';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className='w-full flex justify-between items-center bg-blue-800 text-white p-4 relative z-50'>
      {/* Logo Section */}
      <div>
        <Link to='/'>
          <img src={LOGO} alt="Logo" className='w-max h-7' />
        </Link>
      </div>

      <div className='md:hidden'>
        <button onClick={() => setIsOpen(!isOpen)} className='text-white'>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <nav className='hidden md:flex space-x-8'>
        <ul className='flex space-x-8'>
          <li>
            <Link to='/' className='hover:text-gray-300'>Home</Link>
          </li>
          <li>
            <Link to='#' className='hover:text-gray-300'>About</Link>
          </li>
          <li>
            <Link to='#' className='hover:text-gray-300'>Trainers</Link>
          </li>
          <li>
            <Link to='#' className='hover:text-gray-300'>Contact</Link>
          </li>
        </ul>
      </nav>

      {/* Get Started Button for Desktop */}
      <div className='hidden md:block'>
        <Link to='/get-started'>
          <button className='bg-white hover:bg-slate-200 text-blue-800 px-4 py-2 rounded'>
            Get Started
          </button>
        </Link>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-blue-800 text-white transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden z-50`}
      >
        <ul className='flex flex-col items-start p-4 space-y-4'>
          <li>
            <Link to='/' className='hover:text-gray-300' onClick={() => setIsOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to='#' className='hover:text-gray-300' onClick={() => setIsOpen(false)}>About</Link>
          </li>
          <li>
            <Link to='#' className='hover:text-gray-300' onClick={() => setIsOpen(false)}>Trainers</Link>
          </li>
          <li>
            <Link to='#' className='hover:text-gray-300' onClick={() => setIsOpen(false)}>Contact</Link>
          </li>
          <li>
            <Link to='/get-started'>
              <button className='bg-white hover:bg-slate-200 text-blue-800 px-4 py-2 rounded w-full'>
                Get Started
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
