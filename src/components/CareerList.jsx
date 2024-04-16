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
        <div className="text-white flex flex-col min-h-screen w-full min-w-[320px] bg-gray-100 dark:bg-gray-900">
            <div className="px-4 py-5 mx-auto max-w-7xl">
                <div className="mb-6 flex items-center">
                    <BackButton />
                    <h1 className="ml-4 text-2xl font-bold">{universityName}</h1>
                </div>
                <h2 className="text-lg font-semibold mb-4">Elige una carrera:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {careers.map((career) => (
                        <div
                            key={career.id}
                            className="group cursor-pointer rounded-lg border border-gray-200 hover:border-blue-500 shadow-sm overflow-hidden"
                            onClick={() => handleSelectCareer(career.slug)}
                        >
                            <div className="p-4 bg-white dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-600">
                                <h3 className="text-md font-semibold group-hover:text-white">{career.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}