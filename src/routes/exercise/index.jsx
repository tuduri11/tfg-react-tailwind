import { SERVER_DNS } from '../../utils/constants';

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton'
import NotFoundComponent from '../../components/NotFoundComponent';
import ChatBot
 from '../../components/chatBot';
export default function Exercise() {

    const { problemSlug } = useParams();
    const [problem, setProblem] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [notFound, setNotFound] = useState(false);

    // Cargar problema
    useEffect(() => {
        setLoading(true)
        fetch(`${SERVER_DNS}/education/get-problem/${problemSlug}`)
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 404) {
                        setNotFound(true)
                        throw new Error('Problema no encontrado');
                    }
                    throw new Error('Failed to load problem')
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    setProblem(data.problem)
                } else {
                    throw new Error('Failed to load problem');
                }

            })
            .catch((error) => {
                console.error('Error fetching problem:', error)
                setErrorMessage(error.toString());

            })
            .finally(() => setLoading(false));
    }, [problemSlug]);

    if (loading) return <div>Loading...</div>;
    if (notFound) {
        return <NotFoundComponent message="Problema no encontrado" />;
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

                <div className='text-center text-xl'>
                    {problem.name}

                </div>
            </div>
            <div className='text-black'>
            <ChatBot></ChatBot>
            </div>
            
        </div>

    );
}
