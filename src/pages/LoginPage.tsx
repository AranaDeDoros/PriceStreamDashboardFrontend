import React, { useState } from 'react';
import { User, KeyRound, LogIn, FileExclamationPoint } from 'lucide-react';
import { useLogin } from '../api/auth';
import { setAuthTokens } from '../api/client';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    login(
      { username, password },
      {
        onSuccess: (data) => {
          console.log('Login successful:', data);
          setAuthTokens(data);
          navigate('/dashboard');
        },
        onError: (error) => {
          setError(error?.response?.data?.detail ?? 'Login failed');
          setTimeout(() => {
            setError(null);
          }, 4000);
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#d3dcf2] p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="inline-flex w-full items-center rounded-lg border border-gray-300 px-3 py-2 transition">
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
              <User className="mr-3 inline h-10 w-10" />
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg px-3 py-2 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="username"
            />
          </div>
          <div className="inline-flex w-full items-center rounded-lg border border-gray-300 px-3 py-2 transition">
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              <KeyRound className="mr-3 inline h-10 w-10" />
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-3 py-2 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="password"
            />
          </div>
          {error && (
            <div className="animate-pulse rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 transition-discrete">
              <FileExclamationPoint className="mr-2 inline h-4 w-4" />
              {error}
            </div>
          )}
          <div className="inline-flex w-full items-center rounded-lg px-3 py-2 transition">
            <button
              type="submit"
              disabled={isPending}
              className={`w-full transform cursor-pointer rounded-lg bg-[#566999] py-2 font-medium transition ${
                isPending
                  ? 'cursor-not-allowed bg-[#566999] opacity-70'
                  : 'bg-[#566999] opacity-100 hover:bg-[#7b8dba] active:scale-[0.98]'
              } text-white`}
            >
              {isPending ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn className="mr-3 inline h-5 w-5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
