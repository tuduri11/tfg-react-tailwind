import React from 'react';
import { useNavigate } from 'react-router-dom';

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
                <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">404: {message}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Lo sentimos, no podemos encontrar lo que estás buscando.</p>
                <button onClick={handleReturn} className="rounded-lg border border-blue-700 bg-blue-700 px-6 py-3 font-semibold leading-6 text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring focus:ring-blue-400 focus:ring-opacity-50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-opacity-90 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-100">
                    Volver
                </button>
            </div>
        </div>
    );
};
