import React from 'react';
import { useNavigate } from 'react-router-dom';

//Componente cuando no encontramos algo.
export default function NotFoundComponent({ message, returnPath }) {
    const navigate = useNavigate();
    const handleReturn = () => {
        if (returnPath) {
            navigate(returnPath);
        } else {
            navigate(-1); // Volver a la página anterior si no se especifica returnPath
        }
    };

    return (
        <div id="page-container" className="text-white mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-100 dark:bg-gray-900">

            <div className="h-screen flex flex-col items-center justify-center">
                <p className="p-3 text-sm font-medium text-blue-500 rounded-full bg-blue-50 dark:bg-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                </p>
                <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">404: {message}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Lo sentimos, no podemos encontrar lo que estás buscando.</p>
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
