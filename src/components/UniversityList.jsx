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
        <div id="page-container" className="text-white mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-100 dark:bg-gray-900">

            <div className="p-4">
                <h2 className="text-lg font-semibold mb-4">Escoge tu universidad:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {universities.map((university) => (
                        <div
                            key={university.id}
                            className="cursor-pointer p-4 border border-gray-200 rounded hover:bg-gray-700"
                            onClick={() => handleSelectUniversity(university.slug)}
                        >
                            <h3 className="text-md font-semibold">{university.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>





    );

}