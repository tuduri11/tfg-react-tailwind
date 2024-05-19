import React from 'react';

const ErrorMessage = ({ message }) => {
    return (
        <div className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex items-center justify-center w-12 bg-red-500">
                {/* Ícono de X */}
                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6L18 18M6 18L18 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            <div className="px-4 py-2 -mx-3">
                <div className="mx-3">
                    <span className="font-semibold text-red-500 dark:text-red-400">Error</span>
                    <p className="text-sm text-gray-600 dark:text-gray-200">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;
