import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../../session';
import { SERVER_DNS } from '../../utils/constants';
import { useAuth } from '../../utils/AuthContext';



export default function AfterPay() {
    const { isPremium, setIsPremium } = useAuth();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Función para obtener si el usuario es premium desde el backend
    useEffect(() => {
        const verifyPremiumStatus = async () => {
            try {
                let accessToken = await getAccessToken();
                setLoading(true);
                await fetch(`${SERVER_DNS}/accounts/get-ispremium`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            setSuccess(data.msg); // Si es premium, success sera true.
                            setIsPremium(data.msg); //actualizamos la variable local para saber en todo momento que es premium.
                        } else {
                            console.error('Error al cargar la información:', data.msg);
                        }
                    })
                    .catch(error => console.error('Error en la red:', error))
            }
            catch (error) {
                console.error('Error verificando el estado premium:', error);
            } finally {
                setLoading(false);
            }
        };

        verifyPremiumStatus();
    }, [setSuccess]);

    if (loading) {
        return <div className="text-center">Cargando...</div>;
    }

    return (
        {/* Page Container */ },
        <div className="mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
            {/* Page Content */}
            <main className="flex max-w-full flex-auto flex-col">
                <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
                    {/*Section */}
                    <section className="w-full max-w-xl py-6">
                        {/* END Header */}
                        {success ? (
                            <div className="flex flex-col items-center overflow-hidden rounded-lg shadow-lg border-2 border-green-300 bg-green-50 p-5 md:p-12">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-3xl font-bold text-center text-green-700 flex items-center">
                                        <svg className="w-8 h-8 mr-2 fill-current text-green-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zM8 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z" />
                                        </svg>
                                        ¡Felicidades!
                                    </h2>
                                </div>
                                <p className="text-lg mb-6 font-medium text-green-600">
                                    Ahora eres premium. Gracias por apoyar nuestro servicio.
                                </p>
                                <button
                                    onClick={() => navigate('/universidades')}
                                    className="inline-flex items-center justify-center px-8 py-3 font-semibold rounded-lg text-white bg-gradient-to-r from-teal-500 to-teal-700 hover:bg-teal-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 max-w-xs"
                                >
                                    Empezar!
                                </button>
                            </div>

                        ) : (
                            <div className="flex flex-col overflow-hidden rounded-lg border bg-red-100 border-red-400 text-red-700">
                                <div className="grow p-5 md:px-16 md:py-12">
                                    <h2 className="mb-2 inline-flex items-center space-x-2 text-2xl font-bold">HUBO UN PROBLEMA</h2>
                                    <p className="text-base font-medium">Por favor, intenta de nuevo o contacta soporte si el problema persiste.</p>
                                    <div className="flex justify-around mt-4">
                                        <button
                                            onClick={() => navigate('/premium')}
                                            className="mt-8 px-8 py-3 font-semibold bg-rose-500 text-white rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:bg-red-700"
                                        >
                                            Intentar de nuevo
                                        </button>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="mt-8 px-8 py-3 font-semibold bg-slate-400  text-white rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:bg-gray-700"
                                        >
                                            Ir al inicio
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
