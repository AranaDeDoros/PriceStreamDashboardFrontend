import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import { clearAuthTokens } from '../api/client';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('access_token');

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    clearAuthTokens();
    navigate('/login');
  };

  return (
    <nav className="bg-[#566999] text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold">
              <LayoutDashboard className="h-6 w-6" />
              <span>PriceStream</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-opacity-20 flex cursor-pointer items-center gap-2 rounded-lg bg-[#566999] px-3 py-1 text-sm font-medium transition hover:bg-[#7b8dba]">
              <User className="h-4 w-4" />
              <span>Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-opacity-80 flex cursor-pointer items-center gap-2 rounded-lg bg-[#b02c39] px-4 py-1 text-sm font-medium transition hover:bg-[#d44856] focus:ring-2 focus:ring-red-400 focus:outline-none"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
