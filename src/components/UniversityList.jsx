import { SERVER_DNS } from '../utils/constants';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//Cargar todas las universidades disponibles
export default function UniversityList() {

    const [universities, setUniversities] = useState([]);
    const navigate = useNavigate()

    // Cargar universidades
    useEffect(() => {
        fetch(`${SERVER_DNS}/education/get-universities`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setUniversities(data.universities);
                }
            })
            .catch((error) => {
                console.error('Error fetching universities:', error);
            });
    }, []);

    const handleSelectUniversity = (slug) => {
        navigate(`/universidades/${slug}`); // Navega a la ruta de la universidad seleccionada
    };

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-7xl px-4 py-6">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
                    Escoge tu universidad
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {universities.map(university => (
                        <div
                            key={university.id}
                            className="transform hover:-translate-y-2 transition duration-300 ease-in-out cursor-pointer rounded-lg overflow-hidden shadow-lg"
                            onClick={() => handleSelectUniversity(university.slug)}
                        >
                            <div className="bg-white dark:bg-gray-800 p-6 flex flex-col justify-between h-full">
                                <h2 className="text-lg text-center md:text-xl font-semibold text-gray-900 dark:text-white">
                                    {university.name}
                                </h2>
                                <p className="text-sm text-center mt-2 text-blue-500 dark:text-blue-300">
                                    {university.ubication}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}