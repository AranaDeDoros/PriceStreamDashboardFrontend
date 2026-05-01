import { SearchX } from 'lucide-react';
import '../../styles/dashboard.css';
import { useNavigate } from 'react-router-dom';
const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-gray-100 to-indigo-50 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-[#b8c5e6] bg-gradient-to-br from-[#d3dcf2] to-[#c5d1eb] p-12 text-center shadow-2xl">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/50 shadow-inner backdrop-blur-sm">
          <SearchX className="h-12 w-12 text-[#566999]" />
        </div>
        <h1 className="text-5xl font-black tracking-tight text-gray-800">404</h1>
        <h2 className="mt-2 text-2xl font-bold text-gray-700">Page Not Found</h2>
        <p className="mt-4 font-medium text-gray-500">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-10 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#566999] to-[#4a5a82] px-8 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:brightness-110 hover:shadow-indigo-900/20 active:scale-95"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
