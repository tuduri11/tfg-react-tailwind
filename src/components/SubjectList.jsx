import { SERVER_DNS } from '../utils/constants';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import NotFoundComponent from './NotFoundComponent';
import EmptyList from './EmptyList';
import LoadingComponent from './LoadingComponent';
import ErrorState from './ErrorState';

export default function TopicList() {
    const { universitySlug, careerSlug } = useParams();
    const navigate = useNavigate();
    const [careerName, setCareerName]= useState('');
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [notFound, setNotFound] = useState(false);

    // Cargar asignaturas cuando se selecciona una carrera
    useEffect(() => {
        setLoading(true)
        fetch(`${SERVER_DNS}/education/${careerSlug}/subjects`)
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 404) {
                        setNotFound(true)
                        throw new Error('Carrera no encontrada')
                    }
                    throw new Error('Failed to load subjects')
                }
                return response.json()
            })
            .then((data) => {
                if (data.success) {
                    setSubjects(data.subjects)
                    setCareerName(data.careerName)
                } else {
                    throw new Error('Failed to load subjects')
                }
            })
            .catch((error) => {
                console.error('Error fetching subjects:', error)
                setErrorMessage(error.toString())
            })
            .finally(() => setLoading(false));
    }, [careerSlug]);

    const handleSelectSubject = (subjectSlug) => {
        // Navega a la ruta de la asignatura seleccionada
        navigate(`/universidades/${universitySlug}/${careerSlug}/${subjectSlug}`);
    };

    if (loading){
        return <LoadingComponent></LoadingComponent>
    }
    if (notFound) {
        return <NotFoundComponent message="Carrera no encontrada" />;
    }

    if (errorMessage) {
        return <ErrorState errorMessage={errorMessage}></ErrorState>
    }

    if(subjects.length === 0){
        return <EmptyList entityName="asignaturas" />;
    }


    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-7xl px-4 py-6">
                <div className="mb-6 flex items-center">
                    <BackButton />
                    <h1 className="ml-4 text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{careerName}</h1>
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4">Asignaturas:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map(subject => (
                        <div
                            key={subject.id}
                            className="transform hover:-translate-y-2 transition duration-300 ease-in-out cursor-pointer rounded-lg overflow-hidden shadow-lg"
                            onClick={() => handleSelectSubject(subject.slug)}
                        >
                            <div className="bg-white dark:bg-gray-800 p-6">
                                <h3 className="text-md md:text-lg font-semibold text-gray-900 dark:text-white">
                                    {subject.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}