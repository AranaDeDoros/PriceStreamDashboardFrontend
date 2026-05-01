import React from 'react';
import '../../styles/dashboard.css';
const Card: React.FC<{ title: string; text: string }> = ({ title, text }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#b8c5e6] bg-gradient-to-br from-[#d3dcf2] to-[#c5d1eb] p-1 shadow-2xl transition-all">
        <div className="rounded-[22px] bg-white/40 p-10 text-center backdrop-blur-md">
          {title === 'Loading...' ? (
            <div className="mb-6 flex justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#566999] border-t-transparent shadow-xl" />
            </div>
          ) : title === 'Error' ? (
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-lg">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          ) : null}
          <h1 className="text-3xl font-black tracking-tight text-gray-800">{title}</h1>
          <p className="mt-4 font-medium text-gray-500 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
