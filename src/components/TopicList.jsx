import { SERVER_DNS } from '../utils/constants';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import NotFoundComponent from './NotFoundComponent';
import EmptyList from './EmptyList';
import LoadingComponent from './LoadingComponent';
import ErrorState from './ErrorState';

export default function TopicList() {
    const { universitySlug, careerSlug, subjectSlug } = useParams();
    const navigate = useNavigate();
    const [subjectName, setSubjectName]= useState('');
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [notFound, setNotFound] = useState(false);

    // Cargar asignaturas cuando se selecciona una carrera
    useEffect(() => {
        setLoading(true)
        fetch(`${SERVER_DNS}/education/${subjectSlug}/topics`)
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 404) {
                        setNotFound(true)
                        throw new Error('Asignatura no encontrada')
                    }
                    throw new Error('Failed to load topics')
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setTopics(data.topics)
                    setSubjectName(data.subjectName)
                }
                else {
                    throw new Error('Failed to load topics')
                }
            })
            .catch((error) => {
                console.error('Error fetching topics:', error)
                setErrorMessage(error.toString())
            })
            .finally(() => setLoading(false));
    }, [subjectSlug]);


    const handleSelectTopic = (topicSlug) => {
        navigate(`/universidades/${universitySlug}/${careerSlug}/${subjectSlug}/${topicSlug}`);
    };

    if (loading){
        return <LoadingComponent></LoadingComponent>
    }
    if (notFound) {
        return <NotFoundComponent message="Asignatura no encontrada" />;
    }

    if (errorMessage) {
        return <ErrorState errorMessage={errorMessage}></ErrorState>
    }

    if(topics.length === 0){
        return <EmptyList entityName="temas" />;
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-7xl px-4 py-6">
                <div className="mb-6 flex items-center">
                    <BackButton />
                    <h1 className="ml-4 text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{subjectName}</h1>
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4">Elige el tema:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics.map(topic => (
                        <div
                            key={topic.id}
                            className="transform hover:-translate-y-2 transition duration-300 ease-in-out cursor-pointer rounded-lg overflow-hidden shadow-lg"
                            onClick={() => handleSelectTopic(topic.slug)}
                        >
                            <div className="bg-white dark:bg-gray-800 p-6">
                                <h3 className="text-md md:text-lg font-semibold text-gray-900 dark:text-white">
                                    {topic.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}