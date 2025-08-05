import React, { useEffect, useState } from 'react';
import { LogOut, Plus, User } from 'lucide-react';
import planit from '../../assets/planitIcon.png';
import { useAuth } from '../../context/AuthProvider.jsx';
import TaskModal from '../Modal/TaskModal.jsx';
import ConfirmDialog from '../Modal/ConfirmDialog.jsx';

const NavButton = ({ title, icon: Icon, onClick }) => (
  <button
    title={title}
    onClick={onClick}
    className="p-2 rounded-full border border-gray-700 transition-colors duration-200
      hover:bg-gray-700 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600
      sm:p-2.5 md:p-3"
    >
    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
  </button>
);

function Navbar() {
  const { logout } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [ showConfirm, setShowConfirm ] = useState(false);
  const show = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }
  const handleOpenLogout = () => {
    setShowConfirm(true);
  }
  return (
    <div className="flex justify-center w-full px-4 sm:px-6 md:px-8">
      <nav className="flex justify-between items-center w-full max-w-6xl px-4 py-3 sm:px-6 sm:py-2 md:px-6 md:py-2 
        rounded-full shadow-lg bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white 
        border border-gray-700 my-4 transition-all duration-200">
        
        <div className="flex justify-center h-16 w-16 sm:h-20 sm:w-20 md:h-20 md:w-20 rounded-full object-cover object-center"
          >
          <img
            src={planit}
            alt="PlanIt Logo"
            className="h-16 w-16 object-cover"
          />
          <div className='py-6' >
              <span className='text-xl font-bold font-serif' >PlanIt</span>
          </div>

        </div>

        <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
          <NavButton title="Create Task" icon={Plus} onClick={show} />
          <NavButton title="logout" icon={LogOut} onClick={handleOpenLogout} />
        </div>
      </nav>
      <TaskModal show={showModal} onClose={closeModal} />
      <ConfirmDialog
        open={showConfirm}
        title="Logout"
        description="Are you sure you want to logout? You will be redirected to the login page."
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          logout();
          setShowConfirm(false);
        }}
        confirmText="Logout"
        cancelText="Cancel" 
      />
    </div>
  );
}

export default Navbar;