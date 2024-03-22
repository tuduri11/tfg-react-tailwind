import { SERVER_DNS } from '../utils/constants';

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from './BackButton'

export default function CareerList() {
    const { universitySlug } = useParams();
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Cargar carreras cuando se selecciona una universidad
    useEffect(() => {
        setLoading(true)
        fetch(`${SERVER_DNS}/education/universities/${universitySlug}/careers`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setCareers(data.careers)
                    setLoading(false)
                } else {
                    setError('Failed to load careers')
                }

            })
            .catch((error) => {
                console.error('Error fetching careers:', error)
                setError('Error fetching careers')
                setLoading(false)

            })
            .finally(() => setLoading(false));
    }, [universitySlug]);

    const handleSelectCareer = (careerSlug) => {
        // Navega a la ruta de la carrera seleccionada
        navigate(`/universidades/${universitySlug}/${careerSlug}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div id="page-container" className="text-white mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-100 dark:bg-gray-900">
            <div className="p-4">
                <div className="mb-4">
                    <BackButton />
                </div>
                <h2 className="text-lg font-semibold mb-4">Select a Career:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {careers.map((career) => (
                        <div
                            key={career.id}
                            className="cursor-pointer p-4 border border-gray-200 rounded hover:bg-gray-700"
                            onClick={() => handleSelectCareer(career.slug)}
                        >
                            <h3 className="text-md font-semibold">{career.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>


    );
}