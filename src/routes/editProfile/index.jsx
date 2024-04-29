import React from 'react';
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../../utils/localStorage'
import useEffectWithoutFirstRun from '../../utils/useEffectWithoutFirstRun';
import { getAccessToken } from '../../session';
import { SERVER_DNS } from "../../utils/constants";
import ErrorMessage from '../../components/ErrorMessage';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import SuccessMessage from '../../components/SuccessMessage';
import MathySymbol from '../../components/MathySymbol';
import { useAuth } from '../../utils/AuthContext';
import ConfirmationModal from '../../components/confirmation_modal';
import { isAuthenticated } from '../../session';

export default function EditProfile() {



    const [products, setProducts] = useState();

    const [premium, setPremium] = useState('')

    const [email, setEmail] = useLocalStorage('email', '');

    const [nom, setNom] = useState('');

    const [cognoms, setCognoms] = useState('');

    const [universities, setUniversities] = useState([]);

    const [data, setData] = useState('');

    const [mathys, setMathys] = useState('');

    const { isPremium, setIsPremium } = useAuth();


    const [oldPassword, setOldPassword] = useState('');
    const [showoldPassword, setShowoldPassword] = useState(false);
    const [oldpasswordError, setoldPasswordError] = useState(false)
    const [oldpasswordErrorMessages, setoldpasswordErrorMessages] = useState('')

    const [newPassword, setNewPassword] = useState('');
    const [shownewPassword, setShownewPassword] = useState(false);
    const [newpasswordError, setnewPasswordError] = useState(false)
    const [newpasswordErrorMessages, setnewpasswordErrorMessages] = useState('')

    const [errorPasswordMessages, setErrorPasswordMessages] = useState('');

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const [showSuccessMessageCancel, setShowSuccessMessageCancel] = useState(false);
    const [SuccesMessageCancel, setSuccesMessageCancel] = useState('');

    const [showFailMessageCancel, setShowFailMessageCancel] = useState(false);
    const [FailMessageCancel, setFailMessageCancel] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Función para manejar la confirmación del modal
    const handleModalConfirm = () => {
        handleCancelSubscription();
        setIsModalOpen(false); // Cierra el modal después de confirmar
    };

    // Función para cerrar el modal sin realizar ninguna acción
    const handleModalClose = () => {
        setIsModalOpen(false);
    };


    const navigate = useNavigate();
    const navigateToPremium = () => {
        navigate('/premium');

    };

    function initializeStateFromResponse(res) {
        setNom(res.name);
        setCognoms(res.surname);
        setUniversities(res.university);
        setEmail(res.email);
        //Local premium
        setIsPremium(res.premium);
        setPremium(res.premium)
        setMathys(res.mathys)
    }
    useEffectWithoutFirstRun(() => { initializeStateFromResponse(products) }, [products])

    //Validaciones

    const validateOldPassword = useCallback(() => {
        if (!oldPassword) {
            return;
        }
        if (oldPassword.length < 8) {
            setoldpasswordErrorMessages('Mínimo 8 carácteres');
            setoldPasswordError(true);
        }
        else if (oldPassword.match(/(?=.*?[A-Z])/) == null) {
            setoldpasswordErrorMessages("Al menos una letra mayúscula");
            setoldPasswordError(true);
        }
        else if (oldPassword.match(/(?=.*?[a-z])/) == null) {
            setoldpasswordErrorMessages("Al menos una letra minúscula");
            setoldPasswordError(true);
        }
        else if (oldPassword.match(/(?=.*?[0-9])/) == null) {
            setoldpasswordErrorMessages("Al menos un dígito");
            setoldPasswordError(true);
        }
        else if (oldPassword.match(/(?=.*?[#?.,!@$%^&*-])/) == null) {
            setoldpasswordErrorMessages("Al menos un caracter especial");
            setoldPasswordError(true);
        }
        else {
            setoldPasswordError(oldPassword === '')

        }
    }, [oldPassword])

    const validateNewPassword = useCallback(() => {
        if (!newPassword) {
            return;
        }
        if (newPassword.length < 8) {
            setnewpasswordErrorMessages('Mínimo 8 carácteres');
            setnewPasswordError(true);
        }
        else if (newPassword.match(/(?=.*?[A-Z])/) == null) {
            setnewpasswordErrorMessages("Al menos una letra mayúscula");
            setnewPasswordError(true);
        }
        else if (newPassword.match(/(?=.*?[a-z])/) == null) {
            setnewpasswordErrorMessages("Al menos una letra minúscula");
            setnewPasswordError(true);
        }
        else if (newPassword.match(/(?=.*?[0-9])/) == null) {
            setnewpasswordErrorMessages("Al menos un dígito");
            setnewPasswordError(true);
        }
        else if (newPassword.match(/(?=.*?[#?.,!@$%^&*-])/) == null) {
            setnewpasswordErrorMessages("Al menos un caracter especial");
            setnewPasswordError(true);
        }
        else {
            setnewPasswordError(newPassword === '')

        }
    }, [newPassword])
    const validatePasswords = useCallback(() => {
        validateOldPassword()
        validateNewPassword()
    }, [validateOldPassword, validateNewPassword])

    //Obtenemos la informacion del usuario a través del email de localstorage y del token de usuario.
    useEffect(() => {

        const fetchProfile = async () => {
            try {
                let logged = await isAuthenticated()
                if (!logged) {
                    navigate('/login');
                    return;
                }
                let token = await getAccessToken();
                let jsonData = { "email": email };
                let response = await fetch(`${SERVER_DNS}/accounts/get-profile`, {
                    method: 'POST',
                    mode: 'cors',
                    body: JSON.stringify(jsonData),
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                setProducts(data.msg);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };


        fetchProfile();
    }, [email]);


    //Enviamos al servidor el cambio de contraseña
    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();

        //Ponemos todos los booleanos y mensajes de error a 0.
        setoldPasswordError(false);
        setnewPasswordError(false);
        setoldpasswordErrorMessages('');
        setnewpasswordErrorMessages('');
        setErrorPasswordMessages('');

        //Refrescamos el booleano para que aparezca el mensaje de success si se ha hecho el cambio correctamente
        setShowSuccessMessage(false);

        try {
            let token = await getAccessToken();
            let jsonData = { 'current_password': oldPassword, 'new_password': newPassword };
            let response = await fetch(`${SERVER_DNS}/accounts/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            const data = await response.json();

            if (data.success) {

                console.log('Cambio de contraseña exitoso.');
                // Restablecer los estados o mostrar mensajes de éxito según sea necesario.
                setOldPassword('');
                setNewPassword('');
                setShowoldPassword(false);
                setShownewPassword(false);
                setoldPasswordError(false);
                setnewPasswordError(false);
                setoldpasswordErrorMessages('');
                setnewpasswordErrorMessages('');
                setErrorPasswordMessages('');

                //Ahora podrá aparecer el mensaje de success
                setShowSuccessMessage(true);

            } else {
                // Maneja la respuesta fallida, incluyendo contraseña actual incorrecta.
                if (data.current_password && data.current_password.current_password === "Does not match") {
                    setoldPasswordError(true);
                    setoldpasswordErrorMessages('La contraseña actual no coincide.');
                    setErrorPasswordMessages('La contraseña actual no coincide.');
                } else {
                    // Otros errores
                    setErrorPasswordMessages('Cambio de contraseña fallido.');
                }
            }
        } catch (error) {
            console.error('Error en la petición de cambio de contraseña:', error);
            setErrorPasswordMessages('Error en la petición de cambio de contraseña.');
        }
    };

    //Para cancelar la subscripción
    const handleCancelSubscription = async () => {
        setShowSuccessMessageCancel(false);
        setShowFailMessageCancel(false);
        try {
            let token = await getAccessToken();
            let response = await fetch(`${SERVER_DNS}/accounts/cancel-subscription`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                setIsPremium(false);
                //Ahora podrá aparecer el mensaje de success
                setShowSuccessMessageCancel(true);
                setSuccesMessageCancel(data.msg)

            } else {
                setShowFailMessageCancel(true)
                setFailMessageCancel(data.msg)
            }
        } catch (error) {
            console.error('Error al cancelar la suscripción:', error);
        }
    };



    useEffectWithoutFirstRun(validateNewPassword, [newPassword])
    useEffectWithoutFirstRun(validateOldPassword, [oldPassword])

    return (
        <div className="mx-auto min-h-screen w-full min-w-[320px] flex flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
            <main className="flex flex-col max-w-full flex-auto ">
                <div className="mx-auto flex flex-col w-full max-w-4xl items-center justify-center overflow-hidden p-4 lg:p-8">
                    <section className=" w-full max-w-xl mx-auto py-6">
                        <header className="mb-10 text-center">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                Mi Perfil
                            </h1>
                        </header>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                            <div className="p-5 md:p-8">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-slate-400 flex items-center justify-center">
                                                <span className="text-xl text-white">@</span>
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-gray-900 dark:text-gray-100"><strong>Email:</strong> {email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-slate-400 flex items-center justify-center">
                                                <span className="text-xl text-white">&#128100;</span>
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-gray-900 dark:text-gray-100"><strong>Nombre Completo:</strong> {nom} {cognoms}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-slate-400 flex items-center justify-center">
                                                <span className="text-xl text-white">&#127891;</span>
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-gray-900 dark:text-gray-100"><strong>Universidad:</strong> {universities ? universities.name : "No especificado"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-slate-400 flex items-center justify-center">
                                                <MathySymbol />
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-gray-900 dark:text-gray-100"><strong>Mathys:</strong> {mathys}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>




                    <section className="w-full max-w-xl py-6">
                        <header className="mb-10 text-center">
                            <h2 className="text-lg font-bold">Tu suscripción</h2>
                        </header>
                        <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:text-gray-100 p-5 md:px-16 md:py-12 space-y-4">
                            {/* Condición para verificar si el usuario es premium */}
                            {isPremium ? (
                                <div className="text-center">
                                    <p>Eres un usuario premium.</p>
                                    <div className="flex justify-center items-center space-x-2">
                                        <span className="text-white font-bold">{mathys}</span>
                                        <MathySymbol />
                                    </div>
                                    <button className="mt-4 inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-black uppercase transition bg-gray-400 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:bg-gray-500"
                                        onClick={() => setIsModalOpen(true)}>
                                        Cancelar suscripción
                                    </button>
                                    {/* ConfirmationModal colocado al final del return de tu componente */}
                                    <ConfirmationModal
                                        isOpen={isModalOpen}
                                        onClose={handleModalClose}
                                        onConfirm={handleModalConfirm}
                                        title="Cancelar Suscripción"
                                        description="¿Estás seguro de que deseas cancelar tu suscripción?"
                                    />
                                </div>
                            ) : (

                                <div className="text-center">
                                    <p>No eres un usuario premium.</p>
                                    {/* Botón para hacerse premium. */}
                                    <button onClick={navigateToPremium} className="mt-4 inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-blue-700 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 hover:bg-blue-600">
                                        Hazte premium
                                    </button>
                                </div>
                            )}
                            {/*Si todo va correctamente, enviamos mensaje de confirmación con el componente SuccessMessageCancel*/}
                            {showSuccessMessageCancel && <SuccessMessage message={SuccesMessageCancel} />}

                            {/*Si hay algun error enviado desde backend: */}
                            {showFailMessageCancel && <ErrorMessage message={FailMessageCancel} />}
                        </div>

                    </section>

                    {/* Sección de cambio de contraseña */}
                    <section className="w-full max-w-xl py-6">
                        <header className="mb-10 text-center">
                            <h2 className="text-lg font-bold">Cambio de contraseña</h2>
                        </header>
                        <form
                            className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:text-gray-100 p-5 md:px-16 md:py-12 space-y-6"
                            onSubmit={handleChangePasswordSubmit}
                        >
                            {/* Campos del formulario de cambio de contraseña */}
                            <div className={`space-y-1 ${oldpasswordError ? 'text-red-500' : ''}`}>
                                <label htmlFor="oldPassword" className="text-sm font-medium">Contraseña actual</label>
                                <div className="relative">
                                    <input
                                        type={showoldPassword ? 'text' : 'password'}
                                        value={oldPassword}
                                        placeholder="************"
                                        onChange={(e) => { setOldPassword(e.target.value) }}
                                        className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowoldPassword(!showoldPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                        {showoldPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                    {oldpasswordError && <p className="text-red-500 text-xs italic">{oldpasswordErrorMessages}</p>}
                                </div>
                            </div>
                            <div className={`space-y-1 ${newpasswordError ? 'text-red-500' : ''}`}>
                                <label htmlFor="newPassword" className="text-sm font-medium">Nueva contraseña</label>
                                <div className="relative">
                                    <input
                                        type={shownewPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        placeholder="************"
                                        onChange={(e) => { setNewPassword(e.target.value) }}
                                        className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShownewPassword(!shownewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >
                                        {shownewPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                    {newpasswordError && <p className="text-red-500 text-xs italic">{newpasswordErrorMessages}</p>}
                                </div>
                            </div>
                            {/*Si todo va correctamente, enviamos mensaje de confirmación con el componente SuccessMessage*/}
                            {showSuccessMessage && <SuccessMessage message="Cambio de contraseña realizado con éxito." />}
                            {/*Si hay algun error enviado desde backend, se pondra en el componente ErrorMessage */}
                            {errorPasswordMessages && <ErrorMessage message={errorPasswordMessages} />}

                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center space-x-2 rounded-lg border border-blue-700 bg-blue-700 px-6 py-3 font-semibold leading-6 text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring focus:ring-blue-400 focus:ring-opacity-50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-opacity-90 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                                //Al clickar, validamos las dos contraseñas
                                onClick={validatePasswords}
                                //Si hay algun error, no se puede pulsar el boton
                                disabled={oldpasswordError || newpasswordError}
                            >
                                Cambiar contraseña
                            </button>
                        </form>
                    </section>
                </div>



            </main>
        </div>
    );
}
