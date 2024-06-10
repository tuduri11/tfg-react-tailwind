import React, { useState, useEffect } from 'react';
import { SERVER_DNS } from "../../utils/constants";
import { getAccessToken } from '../../session';
import LoadingComponent from '../../components/LoadingComponent';
import ErrorMessage from '../../components/ErrorMessage';
import { Doughnut } from 'react-chartjs-2';
import { useAuth } from '../../utils/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../session';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

//Ruta para ver las estadisticas del usuario y el ranking general.
export default function Statistics() {
    const { isSendingResults } = useAuth();
    const [userStats, setUserStats] = useState(null);
    const [errorMessages, setErrorMessages] = useState('');
    const [newUserMessage, setNewUserMessage] = useState('');
    const navigate= useNavigate();

    const [userRanking, setuserRanking] = useState(null);
    const [rankingGeneral, setRankingGeneral] = useState([]);
    const [errormessageRanking, seterrorMessageRanking] = useState('');

    const [statsLoaded, setStatsLoaded] = useState(false);
    const [rankingLoaded, setRankingLoaded] = useState(false);

    //Funcion para obtener las estadisticas del usuario propio.
    const FetchUserStats = async () => {
        try {
            let logged = await isAuthenticated()
                if (!logged) {
                    navigate('/login');
                    return;
                }
            let token = await getAccessToken();
            let response = await fetch(`${SERVER_DNS}/education/userStats`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                setUserStats(data.data)
                //Si el usuario no tiene intentos (y es nuevo), en vez de las estadisticas le saldra un mensaje.
                if (data.data.num_attempts === 0) {
                    setNewUserMessage('¡A qué esperas para hacer algunos ejercicios y ver tus estadísticas!')
                }
            } else {
                setErrorMessages(data.msg || 'No stats available')
            }
        } catch (error) {
            setErrorMessages('Failed to fetch statistics');
        } finally {
            setStatsLoaded(true)
        }
    };

    //Funcion para obtener el ranking general de la aplicacion
    const FetchRanking = async () => {
        try {
            let token = await getAccessToken();
            let response = await fetch(`${SERVER_DNS}/education/ranking`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setRankingGeneral(data.data || []);
                setuserRanking(data.user_rank || 'Necesitas más intentos para entrar en el ranking');
            } else {
                seterrorMessageRanking(data.message || 'No stats available');
            }
        }
        catch (error) {
            seterrorMessageRanking(error.message || 'Failed to fetch user ranking');
        } finally {
            setRankingLoaded(true);
        }
    };

    //Puede ser entramos a las estadisticas y aun no se han recibido los resultados de los ultimos ejercicios. Ponemos un timer.
    useEffect(() => {
        let timeoutId;

        const fetchStatsIfNeeded = async () => {
            if (!isSendingResults) {
                await FetchUserStats();
                await FetchRanking();
            } else {
                // Si aún se están enviando resultados, planifica volver a intentar después de un retardo
                timeoutId = setTimeout(() => {
                    FetchUserStats();
                    FetchRanking();
                }, 500);
            }
        };

        fetchStatsIfNeeded();

        // Limpieza del timeout si el componente se desmonta o si el estado de isSendingResults cambia
        // antes de que el timeout se complete.
        return () => clearTimeout(timeoutId);
    }, [isSendingResults]);

    const chartData = {
        labels: ['Intentos Exitosos', 'Intentos Fallidos'],
        datasets: [{
            data: [userStats?.success, userStats ? userStats.num_attempts - userStats.success : 0],
            backgroundColor: ['#10b981', '#ef4444'],
            hoverBackgroundColor: ['#34d399', '#f87171']
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                }
            },
            tooltip: {
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                },
                bodyColor: 'white',
                titleColor: 'white'
            }
        }
    };

    if (!statsLoaded && !rankingLoaded) {
        return <LoadingComponent></LoadingComponent>
    }

    return (
        <div id="page-container" className="overflow-auto text-white mx-auto flex min-h-screen w-full flex-col bg-gray-900 p-4">
            <div className="mx-auto max-w-5xl p-5 sm:p-3 w-full">
                <h1 className="text-3xl font-bold text-center mb-6">Tus Estadísticas</h1>
                {newUserMessage && (
                    <div className="max-w-md mx-auto mb-4 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-5">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white text-center">
                                ¡Bienvenido/a!
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-400 text-center">
                                {newUserMessage}
                            </p>
                        </div>
                    </div>
                )}
                {userStats ? (
                    <div className="p-4 bg-gray-700 rounded shadow flex flex-col items-center space-y-4 w-full">
                        <div className="w-full max-w-xs mx-auto">
                            <Doughnut data={chartData} options={chartOptions} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-center">
                            <div className="bg-gray-600 p-4 rounded shadow">
                                <p className="text-lg font-semibold">Total de Intentos</p>
                                <p className="text-2xl">{userStats.num_attempts}</p>
                            </div>
                            <div className="bg-gray-600 p-4 rounded shadow">
                                <p className="text-lg font-semibold">Intentos Exitosos</p>
                                <p className="text-2xl">{userStats.success}</p>
                            </div>
                            <div className="bg-gray-600 p-4 rounded shadow">
                                <p className="text-lg font-semibold">Tasa de Éxito</p>
                                <p className="text-2xl">{userStats.num_attempts > 0 ? ((userStats.success / userStats.num_attempts) * 100).toFixed(2) + '%' : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center p-4">
                        {errorMessages ? (
                            <ErrorMessage message={errorMessages} />
                        ) : null}
                    </div>
                )}
                {rankingGeneral.length > 0 && (
                    <div className="mt-8 w-full">
                        <h2 className="text-2xl font-bold text-center text-white">Ranking Mundial</h2>
                        <div className="mt-4 bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full leading-normal w-full">
                                    <thead>
                                        <tr className="bg-gray-700 text-white">
                                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Posición</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Estudiante</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Intentos</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Aciertos</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">Tasa de Éxito (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {rankingGeneral.map((student, index) => (
                                            <tr key={index} className={`hover:bg-gray-200 ${userRanking === index + 1 ? 'bg-amber-200' : ''}`}>
                                                <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-900 font-bold">{index + 1}</td>
                                                <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-600">{student.student_name}</td>
                                                <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-600">{student.num_attempts}</td>
                                                <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-600">{student.success}</td>
                                                <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-600 font-bold">{student.success_rate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                <div className="p-4 flex justify-center items-center">
                    {userRanking !== null ? (
                        <div>
                            <p className="text-lg font-semibold text-center">Tu posición en el ranking es:</p>
                            <p className="text-xl text-center font-bold text-blue-600">{typeof userRanking === 'number' ? `#${userRanking}` : userRanking}</p>
                        </div>
                    ) : (
                        <ErrorMessage message={errormessageRanking ? errormessageRanking : 'Error desconocido'} className="text-red-500 text-center" />
                    )}
                </div>
            </div>
        </div>
    );
};