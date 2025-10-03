// components/Header/Header.tsx
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-indigo-600 focus:outline-none transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Internet Cafe Management
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <NotificationBell />
          
          <UserDropdown 
            user={user}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            logout={logout}
          />
        </div>
      </div>
    </header>
  );
};

const NotificationBell = () => (
  <button className="p-2 text-gray-600 hover:text-indigo-600 relative transition-colors duration-200 rounded-lg hover:bg-gray-100">
    <FiBell className="h-5 w-5" />
    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
  </button>
);

interface UserDropdownProps {
  user: any;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  logout: () => void;
}

const UserDropdown = ({ user, showDropdown, setShowDropdown, logout }: UserDropdownProps) => (
  <div className="relative">
    <button
      onClick={() => setShowDropdown(!showDropdown)}
      className="flex items-center space-x-2 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
    >
      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
        <FiUser className="text-white text-sm" />
      </div>
      <span className="text-sm font-medium text-gray-700 hidden md:inline">
        {user?.username}
      </span>
    </button>
    
    {showDropdown && (
      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 animate-fade-in">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Logged in as</div>
          <div className="font-semibold text-gray-900">{user?.username}</div>
          <div className="text-xs text-indigo-600 font-medium capitalize">{user?.role}</div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          <FiLogOut className="mr-3 text-gray-400" />
          Logout
        </button>
      </div>
    )}
  </div>
);

export default Header;