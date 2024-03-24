import { SERVER_DNS } from '../utils/constants';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import NotFoundComponent from './NotFoundComponent';

export default function TopicList() {
    const { universitySlug, careerSlug } = useParams();
    const navigate = useNavigate();
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

    if (loading) return <div>Loading...</div>;
    if (notFound) {
        return <NotFoundComponent message="Carrera no encontrada" />;
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
                <h2 className="text-lg font-semibold mb-4">Select a Subject:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject) => (
                        <div
                            key={subject.id}
                            className="cursor-pointer p-4 border border-gray-200 rounded hover:bg-gray-700"
                            onClick={() => handleSelectSubject(subject.slug)}
                        >
                            <h3 className="text-md font-semibold">{subject.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
}