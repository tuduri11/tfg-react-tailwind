import { SERVER_DNS } from '../utils/constants';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from './BackButton'
import NotFoundComponent from './NotFoundComponent';
import EmptyList from './EmptyList';
import LoadingComponent from './LoadingComponent';
import ErrorState from './ErrorState';

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

    if (loading){
        return <LoadingComponent></LoadingComponent>
    }
    if (notFound) {
        return <NotFoundComponent message="Tema no encontrado" />;
    }

    if (errorMessage) {
        return <ErrorState errorMessage={errorMessage}></ErrorState>
    }

    if(problems.length === 0){
        return <EmptyList entityName="problemas" />;
    }

    return (
        <div className="text-white flex flex-col min-h-screen w-full min-w-[320px] bg-gray-100 dark:bg-gray-900">
            <div className="px-4 py-5 mx-auto max-w-7xl">
                <div className="mb-6 flex items-center">
                    <BackButton />
                    <h1 className="ml-4 text-2xl font-bold">{topicName}</h1>
                </div>
                <h2 className="text-lg font-semibold mb-4">Elige un problema:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {problems.map((problem) => (
                        <div
                            key={problem.id}
                            className="group cursor-pointer rounded-lg border border-gray-200 hover:border-blue-500 shadow-sm overflow-hidden"
                            onClick={() => handleSelectProblem(problem.slug)}
                        >
                            <div className="p-4 bg-white dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-600">
                                <h3 className="text-md font-semibold group-hover:text-white">{problem.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}