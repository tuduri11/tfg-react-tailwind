import React from 'react';

const LoadingComponent = () => {
    return (
        <div className="text-white flex flex-col min-h-screen w-full min-w-[320px] bg-gray-100 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div> 
                <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">Loading...</p> 
            </div>
        </div>
    );
};

export default LoadingComponent;