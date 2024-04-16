import { SERVER_DNS } from '../../utils/constants';

import React, { useState, useEffect, useCallback } from 'react';
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

export default function Exercise() {
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

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [notFound, setNotFound] = useState(false);

    const { mathys, setMathys } = useAuth();
    const { isLoggedIn } = useAuth();

    const problema = useCallback(() => {
        setIsAnswered(false);
        setWolfram(null);
        setErrorMessageWolfram(null);
        setSolutionRequested(false);

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

    // Cargar problema y sus datos
    useEffect(() => {
        problema();
    }, [problema]);


    function userAnswer(answer) {
        setselectedOptions(answer);
        setisCorrect(answer === problem.respuesta_correcta);
        setIsAnswered(true);
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

    if (loading){
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
