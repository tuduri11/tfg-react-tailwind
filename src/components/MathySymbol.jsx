import React from 'react';

//Simbolo del token Mathy
const TokenSymbol = () => {
  return (
    <div className="flex items-center justify-center bg-yellow-500 text-white rounded-full h-4 w-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-3 h-3" 
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={4} 
          d="M12 4.354a4 4 0 100 15.292M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>
  );
};

export default TokenSymbol;
