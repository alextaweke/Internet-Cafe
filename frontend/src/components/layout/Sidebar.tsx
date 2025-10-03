// components/Sidebar/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { 
  FiHome, 
  FiMonitor, 
  FiBarChart2, 
  FiSettings,
  FiUsers,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown
} from 'react-icons/fi';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <FiHome className="h-5 w-5" />,
    },
    { 
      path: '/computers', 
      label: 'Computers', 
      icon: <FiMonitor className="h-5 w-5" />,
    },
    { 
      path: '/customers', 
      label: 'Customers', 
      icon: <FiUsers className="h-5 w-5" />,
    },
    { 
      path: '/billing', 
      label: 'Billing', 
      icon: <FiDollarSign className="h-5 w-5" />,
    },
    { 
      path: '/reports', 
      label: 'Reports', 
      icon: <FiBarChart2 className="h-5 w-5" />,
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <FiSettings className="h-5 w-5" />,
      subItems: [
        { path: '/settings/profile', label: 'Profile' },
        { path: '/settings/account', label: 'Account' },
        { path: '/settings/security', label: 'Security' }
      ]
    }
  ];

  const toggleSubmenu = (label: string) => {
    setActiveSubmenu(activeSubmenu === label ? null : label);
  };

  return (
    <div className={`
      bg-gradient-to-b from-slate-900 to-slate-800 text-white
      ${isCollapsed ? 'w-20' : 'w-64'}
      transition-all duration-300 ease-in-out
      h-screen fixed shadow-2xl border-r border-slate-700
    `}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <FiMonitor className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Cafe Manager
              </h2>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="text-slate-300 hover:bg-slate-700 p-2 rounded-lg transition-all duration-200 hover:scale-105"
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                isCollapsed={isCollapsed}
                activeSubmenu={activeSubmenu}
                toggleSubmenu={toggleSubmenu}
              />
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-700">
            <div className="text-xs text-slate-400 font-medium">
              v1.0.0
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Internet Cafe System
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface NavItemProps {
  item: any;
  isCollapsed: boolean;
  activeSubmenu: string | null;
  toggleSubmenu: (label: string) => void;
}

const NavItem = ({ item, isCollapsed, activeSubmenu, toggleSubmenu }: NavItemProps) => (
  <li className="relative">
    <div className="group">
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center px-3 py-3 rounded-xl transition-all duration-200 group-hover:bg-slate-700/50 ${
            isActive 
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border-l-2 border-indigo-400 shadow-lg' 
              : 'text-slate-300 hover:text-white'
          }`
        }
        onClick={() => item.subItems && toggleSubmenu(item.label)}
      >
        <span className={`transition-transform duration-200 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
          {item.icon}
        </span>
        {!isCollapsed && (
          <>
            <span className="font-medium flex-1">{item.label}</span>
            {item.subItems && (
              <FiChevronDown className={`transition-transform duration-200 ${
                activeSubmenu === item.label ? 'rotate-180' : ''
              }`} />
            )}
          </>
        )}
      </NavLink>
    </div>

    {!isCollapsed && item.subItems && activeSubmenu === item.label && (
      <ul className="ml-6 mt-1 space-y-1 animate-slide-down">
        {item.subItems.map((subItem: any) => (
          <li key={subItem.path}>
            <NavLink
              to={subItem.path}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-500/20 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                }`
              }
            >
              • {subItem.label}
            </NavLink>
          </li>
        ))}
      </ul>
    )}
  </li>
);

export default Sidebar;