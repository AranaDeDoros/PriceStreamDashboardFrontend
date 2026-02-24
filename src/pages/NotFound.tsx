import { SearchX } from 'lucide-react';
import '../../styles/dashboard.css';
import { useNavigate } from 'react-router-dom';
const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-2xl p-4">
          <div className="flex h-screen flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-bold">
              <SearchX className="mr-3 inline h-10 w-10" />
              Not Found
            </h1>
            <p className="mt-4">Sorry, the page you are looking for does not exist.</p>
            <a
              onClick={() => navigate('/')}
              className="mt-6 inline-block cursor-pointer rounded-lg bg-[#566999] px-4 py-2 text-white transition hover:bg-[#405a8c]"
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
