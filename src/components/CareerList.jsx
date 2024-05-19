import { SERVER_DNS } from '../utils/constants';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from './BackButton'
import NotFoundComponent from './NotFoundComponent';
import EmptyList from './EmptyList';
import LoadingComponent from './LoadingComponent';
import ErrorState from './ErrorState';

export default function CareerList() {
    const { universitySlug } = useParams();
    const [universityName, setUniversityName]= useState('');
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();

    // Cargar carreras cuando se selecciona una universidad
    useEffect(() => {
        setLoading(true)
        fetch(`${SERVER_DNS}/education/${universitySlug}/careers`)
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 404) {
                        setNotFound(true)
                        throw new Error('Universidad no encontrada')
                    }
                    throw new Error('Failed to load careers')
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setCareers(data.careers)
                    setUniversityName(data.universityName)
                } else {
                    throw new Error('Failed to load careers')
                }

            })
            .catch((error) => {
                console.error('Error fetching careers:', error)
                setErrorMessage(error.toString())

            })
            .finally(() => setLoading(false))
    }, [universitySlug]);

    const handleSelectCareer = (careerSlug) => {
        // Navega a la ruta de la carrera seleccionada
        navigate(`/universidades/${universitySlug}/${careerSlug}`)
    };
    
    if (loading){
        return <LoadingComponent></LoadingComponent>
    }
    if (notFound) {
        return <NotFoundComponent message="Universidad no encontrada" />;
    }

    if (errorMessage) {
        return <ErrorState errorMessage={errorMessage}></ErrorState>
    }

    if (careers.length === 0) {
        return <EmptyList entityName="carreras" />;
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-7xl px-4 py-6">
                <div className="mb-6 flex items-center">
                    <BackButton />
                    <h1 className="ml-4 text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{universityName}</h1>
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4">Elige una carrera:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {careers.map(career => (
                        <div
                            key={career.id}
                            className="transform hover:-translate-y-2 transition duration-300 ease-in-out cursor-pointer rounded-lg overflow-hidden shadow-lg"
                            onClick={() => handleSelectCareer(career.slug)}
                        >
                            <div className="bg-white dark:bg-gray-800 p-6">
                                <h3 className="text-md md:text-lg font-semibold text-gray-900 dark:text-white">
                                    {career.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}