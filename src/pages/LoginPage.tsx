import React, { useState } from 'react';
import { User, KeyRound, LogIn, FileExclamationPoint, LayoutDashboard } from 'lucide-react';
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
    <div className="flex min-h-screen items-center justify-center bg-linear-to-tr from-gray-100 to-indigo-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#b8c5e6] bg-linear-to-br from-[#d3dcf2] to-[#c5d1eb] p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#566999] to-[#4a5a82] shadow-lg">
            <LayoutDashboard className="h-6 w-6 text-indigo-300 group-hover:text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-800">Welcome Back</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 transition-colors group-focus-within:text-indigo-600">
              <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500" />
            </div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 bg-white/80 py-3 pr-3 pl-10 text-sm font-medium shadow-sm backdrop-blur-sm transition-all hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              placeholder="Username"
              required
            />
          </div>

          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 transition-colors group-focus-within:text-indigo-600">
              <KeyRound className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500" />
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 bg-white/80 py-3 pr-3 pl-10 text-sm font-medium shadow-sm backdrop-blur-sm transition-all hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              placeholder="Password"
              required
            />
          </div>

          {error && (
            <div className="animate-in fade-in zoom-in flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm font-semibold text-red-600 backdrop-blur-sm duration-300">
              <FileExclamationPoint className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#566999] to-[#4a5a82] py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:shadow-indigo-900/20 hover:brightness-110 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
          >
            {isPending ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
