import React from 'react';

export default function ErrorMessage({ message }) {
  return (
    <div className="my-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{message}</span>
      </div>
    </div>
  );
}
