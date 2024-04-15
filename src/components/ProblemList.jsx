import { SERVER_DNS } from '../utils/constants';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from './BackButton'
import NotFoundComponent from './NotFoundComponent';

export default function ProblemList() {
    const { universitySlug, careerSlug, subjectSlug, topicSlug} = useParams();
    const [topicName, setTopicName]= useState('');
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();

    // Cargar problemas cuando se selecciona un topic
    useEffect(() => {
        setLoading(true)
        fetch(`${SERVER_DNS}/education/${topicSlug}/problems`)
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 404) {
                        setNotFound(true)
                        throw new Error('Tema no encontrado')
                    }
                    throw new Error('Failed to load problems')
                }
                return response.json()
            })
            .then((data) => {
                if (data.success) {
                    setProblems(data.problems)
                    setTopicName(data.topicName)
                } else {
                    throw new Error('Failed to load problems')
                }

            })
            .catch((error) => {
                console.error('Error fetching problems:', error)
                setErrorMessage(error.toString())

            })
            .finally(() => setLoading(false))
    }, [topicSlug]);

    const handleSelectProblem = (problemSlug) => {
        // Navega a la ruta de la carrera seleccionada
        navigate(`/universidades/${universitySlug}/${careerSlug}/${subjectSlug}/${topicSlug}/${problemSlug}`);
    };

    if (loading) return <div>Loading...</div>;
    if (notFound) {
        return <NotFoundComponent message="Tema no encontrado" />;
    }

    if (errorMessage) {
        return <div>Error: {errorMessage}</div>;
    }

    return (
        <div id="page-container" className="text-white mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-100 dark:bg-gray-900">
            <div className="p-4">
                <div className="mb-4">
                    <BackButton />
                    <h1 className="text-xl font-bold">{topicName}</h1>
                </div>
                <h2 className="text-lg font-semibold mb-4">Selecciona el problema:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {problems.map((problem) => (
                        <div
                            key={problem.id}
                            className="cursor-pointer p-4 border border-gray-200 rounded hover:bg-gray-700"
                            onClick={() => handleSelectProblem(problem.slug)}
                        >
                            <h3 className="text-md font-semibold">{problem.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>


    );
}