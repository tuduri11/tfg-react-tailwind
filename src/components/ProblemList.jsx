import { SERVER_DNS } from '../utils/constants';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from './BackButton'
import NotFoundComponent from './NotFoundComponent';
import EmptyList from './EmptyList';
import LoadingComponent from './LoadingComponent';
import ErrorState from './ErrorState';
import FavouriteButton from './favouriteButton';
import toast from 'react-hot-toast';
import { useAuth } from '../utils/AuthContext';
import { getAccessToken } from '../session';
import { isAuthenticated } from '../session';

//Lista de problemas de un tema en concreto.
export default function ProblemList() {
    const { universitySlug, careerSlug, subjectSlug, topicSlug } = useParams();
    const [topicName, setTopicName] = useState('');
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();

    const { isLoggedIn } = useAuth();

    const problemsbyTopic =async () => {
        setLoading(true);

        let headers = {
            'Content-Type': 'application/json'
        };
        // Si el usuario ha iniciado sesión, añade el token a la cabecera
        let logged = await isAuthenticated()
        if (logged) {
            const token = await getAccessToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        fetch(`${SERVER_DNS}/education/${topicSlug}/problems`, {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        })
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
                    console.log(data)
                    setProblems(data.problems.map(problem => ({ ...problem, isFavourite: problem.isFavourite })));
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
        
    }
    // Cargar problemas cuando se selecciona un topic
    useEffect(() => {
        problemsbyTopic()
    }, [topicSlug]);

    //Funcion para marcar un ejercicio como favorito o quitarlo.
    const toggleFavourite = async (problemSlug, index) => {
        try {
            let token = await getAccessToken();
            let response = await fetch(`${SERVER_DNS}/favourites/addFavourites/${problemSlug}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                let updatedProblems = [...problems];
                updatedProblems[index].isFavourite = data.isFavourite;
                setProblems(updatedProblems);
                //Si todo ha ido correcto, saldrá un toast de confirmacion arriba de la pantalla.
                toast.success(data.msg, {
                    style: {
                        border: '1px solid #10b981',
                        padding: '16px',
                        color: '#FFFFFF',
                        backgroundColor: '#1A202C',
                    },
                    iconTheme: {
                        primary: '#10b981',
                        secondary: '#2D3748',
                    },
                });
            } else {
                //Si da error, saldra un toast de error arriba en la pantalla.
                toast.error(data.msg, {
                    style: {
                        border: '1px solid #E53E3E', // Un color rojo que destaque para el borde
                        padding: '16px',
                        color: '#FFFFFF', // Texto blanco para mayor legibilidad en fondos oscuros
                        backgroundColor: '#1A202C', // Un gris oscuro para el fondo, consistente con el tema oscuro de la página
                    },
                    iconTheme: {
                        primary: '#E53E3E', // Rojo para el icono
                        secondary: '#FFFFFF', // Fondo blanco para el icono, para contrastar con el rojo
                    }
                });
                throw new Error(data.msg || 'Error al cambiar el estado de favorito');
            }
        } catch (error) {
            toast.error('Error al cambiar el estado de favorito.', {
                style: {
                    border: '1px solid #E53E3E', // Un color rojo que destaque para el borde
                    padding: '16px',
                    color: '#FFFFFF', // Texto blanco para mayor legibilidad en fondos oscuros
                    backgroundColor: '#1A202C', // Un gris oscuro para el fondo, consistente con el tema oscuro de la página
                },
                iconTheme: {
                    primary: '#E53E3E', // Rojo para el icono
                    secondary: '#FFFFFF', // Fondo blanco para el icono, para contrastar con el rojo
                }
            });
        }
    }

    const handleSelectProblem = (problemSlug) => {
        // Navega a la ruta de la carrera seleccionada
        navigate(`/universidades/${universitySlug}/${careerSlug}/${subjectSlug}/${topicSlug}/${problemSlug}`);
    };

    if (loading) {
        return <LoadingComponent></LoadingComponent>
    }
    if (notFound) {
        return <NotFoundComponent message="Tema no encontrado" />;
    }

    if (errorMessage) {
        return <ErrorState errorMessage={errorMessage}></ErrorState>
    }

    if (problems.length === 0) {
        return <EmptyList entityName="problemas" />;
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-7xl px-4 py-6">
                <div className="mb-6 flex items-center">
                    <BackButton />
                    <h1 className="ml-4 text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{topicName}</h1>
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4">Elige un problema:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {problems.map((problem, index) => (
                        <div
                            key={problem.id}
                            className="transform hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer rounded-lg overflow-hidden shadow-lg"
                            onClick={() => handleSelectProblem(problem.slug)}
                        >
                            <div className="bg-white dark:bg-gray-800 p-6 flex flex-col justify-between h-full">
                                <h3 className="text-md text-center md:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {problem.name}
                                </h3>
                                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">{problem.description || "No description available."}</p>
                                <div>
                                    {isLoggedIn && (
                                        <FavouriteButton isFavourite={problem.isFavourite} onClick={(e) => { e.stopPropagation(); toggleFavourite(problem.slug, index); }}></FavouriteButton>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}