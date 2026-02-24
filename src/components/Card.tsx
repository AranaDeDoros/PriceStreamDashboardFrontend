import React from 'react';
import '../../styles/dashboard.css';
const Card: React.FC<{ title: string; text: string }> = ({ title, text }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl p-4">
        <div className="flex h-screen flex-col items-center justify-center text-center">
          <h1 className="text-6xl font-bold">{title}</h1>
          <p className="mt-4">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
