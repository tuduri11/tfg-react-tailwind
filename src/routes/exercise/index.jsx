import { SERVER_DNS } from '../../utils/constants';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton'
import NotFoundComponent from '../../components/NotFoundComponent';
import ChatBot from '../../components/chatBot';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { shuffleArray } from '../../utils/dateUtils';
import { getAccessToken } from '../../session';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../utils/AuthContext';
import MathySymbol from '../../components/MathySymbol';
import LoadingComponent from '../../components/LoadingComponent';
import ErrorState from '../../components/ErrorState';
import FavouriteButton from '../../components/favouriteButton';
import { isAuthenticated } from '../../session';
import toast from 'react-hot-toast';

export default function Exercise() {
    const { setIsSendingResults } = useAuth();

    const navigate = useNavigate();
    const { problemSlug } = useParams();
    const [problem, setProblem] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOption, setselectedOptions] = useState(null);
    const [isCorrect, setisCorrect] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const [wolfram, setWolfram] = useState(null);
    const [errorMessageWolfram, setErrorMessageWolfram] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);
    const [solutionRequested, setSolutionRequested] = useState(false);
    const [batchData, setBatchData] = useState([]);
    const batchDataRef = useRef(batchData);

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [notFound, setNotFound] = useState(false);

    const { mathys, setMathys } = useAuth();
    const { isLoggedIn} = useAuth();
    const [isFavourite, setIsFavourite] = useState(false);

    const problema = useCallback(async () => {
        setIsAnswered(false);
        setWolfram(null);
        setErrorMessageWolfram(null);
        setSolutionRequested(false);
        setLoading(true)
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
        fetch(`${SERVER_DNS}/education/get-problem/${problemSlug}`, {
            method: 'GET',
            headers: headers,
            credentials: 'include'  // Asumiendo que necesitas enviar cookies para mantener la sesión
        })
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
                    console.log("Data received on reload:", data);
                    setProblem(data.problem)
                    setIsFavourite(data.is_favourite);
                    const allOptions = [data.problem.respuesta_correcta, ...data.problem.respuestas_erroneas];
                    shuffleArray(allOptions);
                    setOptions(allOptions);
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

    const toggleFavourite = async () => {
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
                setIsFavourite(data.isFavourite);
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

    // Cargar problema y sus datos
    useEffect(() => {
            problema();
    }, [problema]);

    useEffect(() => {
        batchDataRef.current = batchData;  // Mantener la referencia actualizada
    }, [batchData]);


    function userAnswer(answer) {
        const correct = answer === problem.respuesta_correcta;
        setselectedOptions(answer);
        setisCorrect(correct);
        setIsAnswered(true);

        // Llama a handleExerciseResult con el resultado de la respuesta
        handleExerciseResult(correct);
    }

    function handleMouseEnter() {
        if (!isAnswered) {
            setShowTooltip(true);
        }
    }

    function handleMouseLeave() {
        setShowTooltip(false);
    }

    const solucionIA = async () => {
        if (!isAnswered || solutionRequested) {
            return;
        }

        else if (isLoggedIn === false) {
            setErrorMessageWolfram("Debes iniciar sesión para obtener la solución completa.");
            return;
        }

        else if (mathys <= 0) {
            setErrorMessageWolfram("No tienes suficientes Mathys.");
            return;
        }

        setSolutionRequested(true);
        try {
            let token = await getAccessToken();
            let response = await fetch(`${SERVER_DNS}/education/get-wolfram`, {
                method: 'POST',
                body: JSON.stringify({ query: problem.operacion }),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            console.log(responseData)
            if (responseData.data && responseData.data.queryresult && responseData.data.queryresult.pods) {
                setWolfram(responseData.data.queryresult.pods); // Guardar los pods de la respuesta
                setErrorMessageWolfram(null);

                //Recibimos los mathys del backend y actualizamos los mathys del contexto.
                setMathys(responseData.user_mathys);
            } else {
                setErrorMessageWolfram(responseData.error || 'Failed to obtain complete solution from IA');
            }
        } catch (error) {
            console.error('Error fetching complete solution:', error);
            setErrorMessageWolfram(error.message || 'Failed to obtain complete solution');
        } finally {
            setSolutionRequested(false);
        }
    }

    const sendResultsToServer = useCallback(async (results) => {
        setIsSendingResults(true);
        try {
            let token = await getAccessToken();
            await fetch(`${SERVER_DNS}/education/exerciseDone`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ results })
            });
            console.log('Results sent:', results);
        } catch (error) {
            console.error('Error sending exercise results:', error);
        } finally {
            setIsSendingResults(false);
        }
    }, []);

    const handleExerciseResult = useCallback((isCorrect) => {
        setBatchData(currentData => {
            const newData = [...currentData, { correct: isCorrect }];
            if (newData.length >= 5) {
                sendResultsToServer(newData);
                return [];
            }
            return newData;
        });
    }, [sendResultsToServer]);


    // Manejar el envío de datos al desmontar y antes de cerrar la página
    useEffect(() => {
        const sendPendingData = () => {
            if (batchDataRef.current.length > 0) {
                sendResultsToServer(batchDataRef.current);
                setBatchData([]);  // Limpiar después de enviar
            }
        };

        window.addEventListener('beforeunload', sendPendingData);

        return () => {
            window.removeEventListener('beforeunload', sendPendingData);
            sendPendingData();  // También enviar al desmontar
        };
    }, [sendResultsToServer]); // Dependencias del efecto, reacciona a cambios en batchData



    if (loading) {
        return <LoadingComponent></LoadingComponent>
    }
    if (notFound) {
        return <NotFoundComponent message="Problema no encontrado" />;
    }

    if (errorMessage) {
        return <ErrorState errorMessage={errorMessage}></ErrorState>
    }


    return (
        <div className="overflow-auto bg-gray-900 text-white min-h-screen ">
            <div className="mx-auto max-w-5xl p-5 sm:p-3">
                <div className="mb-4">
                    <BackButton />
                </div>

                {!isLoggedIn && (
                    <div className="bg-red-500 rounded text-center py-2 px-4 mb-4">
                        <p className="text-white font-semibold">Debes <button onClick={() => navigate('/login')} className="underline text-white">iniciar sesión</button> para responder a los ejercicios o ver las soluciones completas.</p>
                    </div>
                )}
                {isLoggedIn && (
                    <FavouriteButton isFavourite={isFavourite} onClick={() => { setIsFavourite(!isFavourite); toggleFavourite() }}></FavouriteButton>
                )}

                {problem && (
                    <>
                        <h1 className="text-xl sm:text-3xl font-bold text-center mb-6">{problem.name}</h1>
                        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 overflow-auto">
                            <BlockMath math={problem.enunciado} />
                        </div>
                        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6 overflow-auto">
                            <BlockMath math={problem.operacion} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {options.map((option, index) => (
                                <button key={index} onClick={() => userAnswer(option)}
                                    disabled={!isLoggedIn || isAnswered}
                                    className={`p-3 text-sm rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${selectedOption === option ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'} ${isAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <InlineMath math={`${String.fromCharCode(65 + index)}: ${option}`} />
                                </button>
                            ))}
                        </div>
                        {isAnswered && (
                            <div className={`text-center p-4 text-xl rounded-lg ${isCorrect ? 'inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-gradient-to-r from-teal-500 to-teal-700 hover:bg-teal-600 focus:shadow-outline focus:outline-none ease-in-out transform hover:-translate-y-1 hover:scale-100' : 'inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-gradient-to-r from-red-400 to-red-700 hover:bg-red-600 focus:shadow-outline focus:outline-none ease-in-out transform hover:-translate-y-1 hover:scale-100'}`}>
                                {isCorrect ? 'Respuesta Correcta!' : (
                                    <>
                                        Respuesta Incorrecta. La correcta es: <InlineMath math={problem.respuesta_correcta} />
                                    </>
                                )}
                            </div>
                        )}
                        <div className="flex justify-around mt-6 mb-10 space-x-4">
                            <button onClick={problema} className="inline-flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 hover:bg-purple-600 px-7 py-3.5 font-semibold leading-6 text-white hover:text-white transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-100">
                                Otro Ejercicio
                            </button>
                            <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                <button onClick={solucionIA} disabled={!isLoggedIn || !isAnswered || solutionRequested || wolfram != null} className="inline-flex items-center justify-center space-x-2 rounded-lg border border-blue-600 bg-blue-500 px-6 py-3 font-semibold leading-6 text-white hover:border-blue-700 hover:bg-blue-700 hover:text-white focus:ring focus:ring-blue-400 focus:ring-opacity-50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-opacity-90 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span>Solución Completa</span>
                                    <MathySymbol></MathySymbol>
                                </button>
                                {showTooltip && !isAnswered && (
                                    <div className="absolute border -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-6 w-64 rounded shadow-lg z-10">
                                        Por favor, responde al ejercicio para ver la solución completa.
                                    </div>
                                )}
                            </div>
                        </div>
                        {wolfram && (
                            wolfram.map((pod, index) => (
                                <div key={index} className="mb-4 p-4 bg-gray-700 rounded-lg">
                                    <h3 className="text-xl font-bold mb-3 text-white">{pod.title}</h3>
                                    {pod.subpods.map((subpod, subIndex) => (
                                        <div key={subIndex} className="mb-3">
                                            {subpod.img && (
                                                <img
                                                    src={subpod.img.src}
                                                    alt={subpod.img.alt}
                                                    title={subpod.img.title}
                                                    className="mx-auto my-2 w-auto max-w-full border-4 border-white rounded"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))
                        )}
                        {errorMessageWolfram && (
                            <div className="flex items-center justify-center">
                                <ErrorMessage message={errorMessageWolfram}></ErrorMessage>
                            </div>
                        )}
                    </>
                )}

                <div className='text-black'>
                    <ChatBot />
                </div>
            </div>
        </div>
    );
}
