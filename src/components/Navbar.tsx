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
    <nav className="border-b border-white/10 bg-gradient-to-r from-[#566999] to-[#4a5a82] text-white shadow-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="group flex items-center gap-2 text-xl font-black tracking-tighter transition-all hover:scale-105">
              <LayoutDashboard className="h-6 w-6 text-indigo-300 group-hover:text-white" />
              <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">PriceStream</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/10 hover:shadow-lg active:scale-95">
              <User className="h-3.5 w-3.5 text-indigo-300" />
              <span>Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-1.5 text-sm font-bold shadow-lg transition-all hover:from-red-700 hover:to-red-600 hover:shadow-red-500/25 active:scale-95 focus:ring-2 focus:ring-red-400/50 focus:outline-none"
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
