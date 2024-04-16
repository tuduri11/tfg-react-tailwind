import { SERVER_DNS } from '../utils/constants';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


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
        <div className="text-white flex flex-col w-full min-w-[320px] min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="p-4 mx-auto max-w-7xl">
                <h2 className="text-xl md:text-2xl font-semibold mb-6">Escoge tu universidad:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {universities.map((university) => (
                        <div
                            key={university.id}
                            className="group cursor-pointer rounded-lg border border-gray-200 hover:border-blue-500 shadow-sm overflow-hidden"
                            onClick={() => handleSelectUniversity(university.slug)}
                        >
                            <div className="p-4 bg-white dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-600">
                                <h3 className="text-md font-semibold group-hover:text-white">{university.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}