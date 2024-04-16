import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorState = ({ errorMessage }) => {
    const navigate = useNavigate();

    const handleReturn = () => {
        navigate(-1); // Volver a la página anterior
    };

    return (
        <div className="text-white flex flex-col min-h-screen w-full min-w-[320px] bg-gray-100 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center h-screen">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white mt-4">Error al cargar datos</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">{errorMessage || 'Algo salió mal, por favor intenta de nuevo.'}</p>
                <button className="inline-flex items-center justify-center space-x-2 rounded-lg border border-gray-200 bg-white px-7 py-3.5 font-semibold leading-6 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-100"
                    onClick={handleReturn}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                    </svg>
                    Atrás
                </button>
            </div>
        </div>
    );
};

export default ErrorState;