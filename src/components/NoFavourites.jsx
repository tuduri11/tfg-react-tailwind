import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farFaHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function NoFavourites() {
    const navigate = useNavigate();

    return (
        <div id="page-container" className="text-white mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-100 dark:bg-gray-900">
            <div className="flex items-center justify-center w-full min-h-screen">
                <div className="text-center">
                    <FontAwesomeIcon icon={farFaHeart} size="3x" className="text-red-500 mb-4" />
                    <h2 className="text-lg mb-4 text-gray-800 dark:text-white">No tienes favoritos guardados</h2>
                    <p className="text-sm mb-6 text-gray-600 dark:text-gray-400">Ve a hacer ejercicios y guarda tus favoritos aquí.</p>
                    <button
                        className="inline-flex w-full items-center justify-center space-x-2 rounded-lg border border-blue-700 bg-blue-700 px-6 py-3 font-semibold leading-6 text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring focus:ring-blue-400 focus:ring-opacity-50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-opacity-90 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-100"
                        onClick={() => navigate('/universidades')}
                    >
                        Ir a ejercicios
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NoFavourites;