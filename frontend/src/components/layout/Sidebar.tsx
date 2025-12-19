import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // We use this to highlight the active link
import { LayoutDashboard, UploadCloud, History, User, Settings, LogOut, Code2 } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  
  // Helper to check if a link is active
  const isActive = (path: string) => location.pathname === path;

  // List of navigation items
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Code', path: '/upload', icon: UploadCloud },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed h-full flex flex-col z-10 transition-transform duration-300">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <Code2 className="h-8 w-8" />
          <span>CodeGuard</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${isActive(item.path) 
                ? 'bg-primary-light text-primary'  // Active State (Light Green bg)
                : 'text-gray-700 hover:bg-gray-50' // Inactive State
              }
            `}
          >
            <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-primary' : 'text-gray-500'}`} />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout Section at the Bottom */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};