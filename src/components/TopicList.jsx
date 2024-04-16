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
        <div className="text-white flex flex-col min-h-screen w-full min-w-[320px] bg-gray-100 dark:bg-gray-900">
            <div className="px-4 py-5 mx-auto max-w-7xl">
                <div className="mb-6 flex items-center">
                    <BackButton />
                    <h1 className="ml-4 text-2xl font-bold">{subjectName}</h1>
                </div>
                <h2 className="text-lg font-semibold mb-4">Elige el tema:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics.map((topic) => (
                        <div
                            key={topic.id}
                            className="group cursor-pointer rounded-lg border border-gray-200 hover:border-blue-500 shadow-sm overflow-hidden"
                            onClick={() => handleSelectTopic(topic.slug)}
                        >
                            <div className="p-4 bg-white dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-600">
                                <h3 className="text-md font-semibold group-hover:text-white">{topic.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}