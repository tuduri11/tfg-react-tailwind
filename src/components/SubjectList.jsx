import { SERVER_DNS } from '../utils/constants';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from './BackButton';

export default function SubjectList() {
    const { universitySlug, careerSlug } = useParams();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar asignaturas cuando se selecciona una carrera
    useEffect(() => {
        if (!careerSlug) {
            setLoading(false);
            return;
        }
        setLoading(true)
        fetch(`${SERVER_DNS}/education/universities/careers/${careerSlug}/subjects`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setSubjects(data.subjects)
                    setLoading(false)
                }
                else {
                    setError('Failed to load subjects')
                }
            })
            .catch((error) => {
                console.error('Error fetching subjects:', error)
                setError('Error fetching subjects')
                setLoading(false)
            });
    }, [careerSlug]);

    if (loading) return <div>Loading subjects...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleSelectSubject = (subjectSlug) => {
        // Navega a la ruta de la asignatura seleccionada
        navigate(`/universidades/${universitySlug}/${careerSlug}/${subjectSlug}`);
    };

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