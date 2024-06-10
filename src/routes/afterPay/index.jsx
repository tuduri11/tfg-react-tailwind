import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../../session';
import { SERVER_DNS } from '../../utils/constants';
import { useAuth } from '../../utils/AuthContext';
import ErrorPay from '../../components/ErrorPay';
import PaySuccessful from '../../components/PaySuccessful';
import { isAuthenticated } from '../../session';


//Esta ruta es reconducida despues del pago desde stripe. Aqui nos indicara si todo ha ido correctamente o incorrectamente.
export default function AfterPay() {
    const { isPremium, setIsPremium } = useAuth();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const { fetchMathys } = useAuth();

    const navigate = useNavigate();

    // Función para obtener si el usuario es premium desde el backend
    useEffect(() => {
        const verifyPremiumStatus = async () => {
            try {
                let logged = await isAuthenticated()
                if (!logged) {
                    navigate('/login');
                    return;
                }
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
                            fetchMathys()
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
                            <div >
                                <PaySuccessful successMessage='¡Felicidades!' detailMessage='Ahora eres premium. Gracias por apoyar nuestro servicio.'> </PaySuccessful>
                            </div>

                        ) : (
                            <div>
                                <ErrorPay errorMessage='Por favor, intenta de nuevo o contacta soporte si el problema persiste.'></ErrorPay>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
