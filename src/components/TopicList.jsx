import { SERVER_DNS } from '../utils/constants';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import NotFoundComponent from './NotFoundComponent';

export default function TopicList() {
    const { universitySlug, careerSlug, subjectSlug } = useParams();
    const navigate = useNavigate();
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

    if (loading) return <div>Loading...</div>;
    if (notFound) {
        return <NotFoundComponent message="Asignatura no encontrada" />;
    }

    if (errorMessage) {
        return <div>Error: {errorMessage}</div>;
    }

    return (
        <div id="page-container" className="text-white mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-100 dark:bg-gray-900">
            <div className="p-4">
                <div className="mb-4">
                    <BackButton />
                </div>
                <h2 className="text-lg font-semibold mb-4">Select a Topic:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topics.map((topic) => (
                        <div
                            key={topic.id}
                            className="cursor-pointer p-4 border border-gray-200 rounded hover:bg-gray-700"
                            onClick={() => handleSelectTopic(topic.slug)}
                        >
                            <h3 className="text-md font-semibold">{topic.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
}