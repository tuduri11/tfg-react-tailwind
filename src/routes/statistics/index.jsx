import React, { useState, useEffect } from 'react';
import { SERVER_DNS } from "../../utils/constants";
import { getAccessToken } from '../../session';
import LoadingComponent from '../../components/LoadingComponent';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

export default function Statistics() {
    const [userStats, setUserStats] = useState(null);
    const [errorMessages, setErrorMessages] = useState('');
    const [newUserMessage, setNewUserMessage] = useState('');

    useEffect(() => {
        const FetchUserStats = async () => {
            try {
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
                    if (data.data.num_attempts === 0) {
                        setNewUserMessage('¡A qué esperas para hacer algunos ejercicios y ver tus estadísticas!')
                    }
                } else {
                    setErrorMessages(data.msg || 'No stats available')
                }


            } catch (error) {
                setErrorMessages('Failed to fetch statistics');
            }
        };
        FetchUserStats();


    }, []);

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


    return (
        <div id="page-container" className="text-white mx-auto flex min-h-screen w-full flex-col bg-gray-800 p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Tus Estadísticas</h1>
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
                <div className="p-4 bg-gray-700 rounded shadow flex flex-col items-center space-y-4">
                    <div className="w-full max-w-xs">
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
                <div className="p-4">
                    {errorMessages ? <p>{errorMessages}</p> : <LoadingComponent />}
                </div>
            )}
        </div>
    );
};