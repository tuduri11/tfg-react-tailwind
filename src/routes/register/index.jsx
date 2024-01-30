import { useState, useMemo, useEffect, useCallback } from "react";
import useEffectWithoutFirstRun from '../../utils/useEffectWithoutFirstRun';
import { calculateAge, emailBase, nameBase, surnameBase } from '../../utils/dateUtils';
import { SERVER_DNS } from '../../utils/constants';
import ErrorMessage from '../../components/ErrorMessage'
import { FiEye, FiEyeOff } from 'react-icons/fi';
import React from 'react';
import { Routes, Route, useNavigate, redirect } from 'react-router-dom'
import Navbar from "../../components/navbar";
import Footer from "../../components/footer"


export default function Index() {

    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('')

    const [nom, setNom] = useState('');
    const [nomError, setNomError] = useState(false);
    const [nameErrorMessages, setNameErrorMessages] = useState('');

    const [cognoms, setCognoms] = useState('');
    const [cognomsError, setCognomsError] = useState(false);
    const [cognomsErrorMessages, setCognomsErrorMessages] = useState('');

    const [data, setData] = useState('');
    const [dataError, setDataError] = useState(false);
    const [dateErrorMessages, setDateErrorMessages] = useState('')


    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [universityError, setUniversityError] = useState(false);
    const [universityErrorMessage, setUniversityErrorMessage] = useState('');


    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorMessages, setpasswordErrorMessages] = useState('')


    const [errorMessages, setErrorMessages] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const current = new Date();
    const currentDate = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;


    //Validations
    const validateEmail = useCallback(() => {
        const mailformat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi
        if (email === '') {
            setEmailErrorMessage('El email es necesario')
            setEmailError(true)
        }
        else if (email.match(mailformat) == null) {
            setEmailErrorMessage('Formato de email incorrecto')
            setEmailError(true)
        }
        else {
            setEmailErrorMessage('')
            setEmailError(false)
        }
    }, [email])


    const validateNom = useCallback(() => {
        if (nom === '') {
            setNameErrorMessages('El nombre es necesario');
            setNomError(true);
        } else if (nom.match(/^[A-Za-z]+$/) === null) {
            setNameErrorMessages('El nombre solo puede tener letras sin espacios');
            setNomError(true);
        } else {
            setNomError(false);
        }
        console.log('validate nom')
    }, [nom])


    const validateCognoms = useCallback(() => {
        console.log('validate cognom')
        if (cognoms === '') {
            setCognomsErrorMessages('Los apellidos son necesarios');
            setCognomsError(true);
        } else if (cognoms.match(/[0-9]+/) != null) {
            setCognomsErrorMessages('Formato incorrecto');
            setCognomsError(true);
        } else {
            setCognomsError(false);
        }
    }, [cognoms])


    const validateData = useCallback(() => {
        console.log('validate data')
        let date = new Date(data)
        let current = new Date(currentDate)
        if (data === '') {
            setDateErrorMessages('La fecha es necesaria')
            setDataError(true)
        } else if (date >= current) {
            setDateErrorMessages('La fecha de aniversario no puede estar en el futuro');
            setDataError(true);
        } else if (calculateAge(date, current) < 15) {
            setDateErrorMessages('La edad mínima es de 15 años');
            setDataError(true);
        }
        else {
            setDataError(false)
            setDateErrorMessages('')
        }

    }, [data])

    const validatePassword = useCallback(() => {
        if (password.length < 8) {
            setpasswordErrorMessages('Mínimo 8 carácteres');
            setPasswordError(true);
        }
        else if (password.match(/(?=.*?[A-Z])/) == null) {
            setpasswordErrorMessages("Al menos una letra mayúscula");
            setPasswordError(true);
        }
        else if (password.match(/(?=.*?[a-z])/) == null) {
            setpasswordErrorMessages("Al menos una letra minúscula");
            setPasswordError(true);
        }
        else if (password.match(/(?=.*?[0-9])/) == null) {
            setpasswordErrorMessages("Al menos un dígito");
            setPasswordError(true);
        }
        else if (password.match(/(?=.*?[#?.,!@$%^&*-])/) == null) {
            setpasswordErrorMessages("Al menos un caracter especial");
            setPasswordError(true);
        }
        else {
            setPasswordError(password === '')

        }
    }, [password])

    const validateUniversity = () => {
        console.log(selectedUniversity)
        if (!selectedUniversity || selectedUniversity === '') {
            setUniversityErrorMessage('Por favor, selecciona una universidad');
            setUniversityError(true);
        } else {
            setUniversityErrorMessage('');
            setUniversityError(false);
        }
    };



    const validateParameters = useCallback(() => {
        validateEmail()
        validateData()
        validateCognoms()
        validateNom()
        validatePassword()
        validateUniversity()
    }, [validateEmail, validatePassword, validateNom, validateCognoms, validateData, validateUniversity])

    useEffectWithoutFirstRun(validateEmail, [email])
    useEffectWithoutFirstRun(validatePassword, [password])
    useEffectWithoutFirstRun(validateData, [data])
    useEffectWithoutFirstRun(validateNom, [nom])
    useEffectWithoutFirstRun(validateCognoms, [cognoms])
    useEffectWithoutFirstRun(validateUniversity, [selectedUniversity])

    const navigate = useNavigate();
    const navigateToLogIn = () => {
        navigate('/login');

    };

    //Obtenemos las universidades a través de la base de datos
    useEffect(() => {
        fetch(`${SERVER_DNS}/education/get-universities`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setUniversities(data.universities);
                }
            })
            .catch((error) => {
                console.error('Error fetching universities:', error);
            });
    }, []);

    //Enviamos metodo Post de registro a backend.
    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessages('')
        if (!emailError && !passwordError && !nomError && !cognomsError && !dataError && !universityError) {
            setIsSubmitting(true)
            console.log('Submitted')
            //Si no hay la universidad o el user no tiene universidad, pasamos un Null.
            let universityValue = (selectedUniversity === "no-listed" || selectedUniversity === "no-university") ? null : selectedUniversity;

            console.log(universityValue)
            let jsonData = { "email": emailBase(email), "password": password, "name": nameBase(nom), "surname":surnameBase(cognoms), "university": universityValue, "birthdate": data }
            let response = fetch(`${SERVER_DNS}/accounts/register`,
                {
                    method: 'POST',
                    mode: 'cors',
                    body: JSON.stringify(jsonData),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(response => response.json())
                .catch((error) => {
                    setIsSubmitting(false)
                    setErrorMessages('Something went wrong')
                })
            try {
                const { success, msg } = await response
                setIsSubmitting(false)
                if (success) {
                    setIsRegistered(true)
                }
                else {
                    setErrorMessages(msg)
                }
            }
            catch (e) {
                setErrorMessages('Unknown error')
            }
        }
        else {
            setErrorMessages("Please enter valid parameters")
            setIsSubmitting(false)
        }
    };


    return (
        <>
            
            <div
                id="page-container"
                className="mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
            >
                {/* Contenido pagina */}
                <main id="page-content" className="flex max-w-full flex-auto flex-col">
                    <div className="relative mx-auto flex min-h-dvh w-full max-w-10xl items-center justify-center overflow-hidden p-4 lg:p-8">
                        {/* Seccion registro */}
                        <section className="w-full max-w-xl py-6">
                            {/* Header */}
                            <header className="mb-10 text-center">
                                <h1 className="mb-2 inline-flex items-center space-x-2 text-2xl font-bold">
                                    {isRegistered ? 'REGISTRO COMPLETADO!' : 'REGÍSTRATE'}
                                </h1>
                                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400" >

                                    {isRegistered ? '' : 'Únete para ser el mejor!'}
                                </h2>
                            </header>
                            {/* Header acabado */}

                            {/* Formulario registro*/}
                            {isRegistered ? (
                                <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:text-gray-100">
                                    <div className="grow p-5 md:px-16 md:py-12">
                                        <div className="text-center">
                                            <p className="text-lg font-semibold">¡Bienvenido {nom}! Muchas gracias por registrarte en nuestra página web.</p>

                                            <div className="mt-4 flex justify-center space-x-4">
                                                <button
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                    onClick={() => navigate('/edit-perfil')}
                                                >
                                                    Editar Perfil
                                                </button>

                                                <button
                                                    className="inline-flex items-center justify-center space-x-2 rounded-lg border border-gray-200 bg-white px-7 py-3.5 font-semibold leading-6 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700"
                                                    onClick={() => navigate('/home')}
                                                >
                                                    Inicio
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ) : ( 
                            <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:text-gray-100">

                                <div className="grow p-5 md:px-16 md:py-12">

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Nombre*/}
                                        <div className={`space-y-1 ${nomError ? 'text-red-500' : ''}`}>
                                            <label htmlFor="nombre" className="text-sm font-medium">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                value={nom}
                                                placeholder="Introduzca su nombre"
                                                onChange={(e) => setNom(e.target.value)}
                                                className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                                            />
                                            {nomError && <p className="text-red-500 text-xs italic">{nameErrorMessages}</p>}
                                        </div>
                                        {/*Apellidos */}
                                        <div className={`space-y-1 ${cognomsError ? 'text-red-500' : ''}`}>
                                            <label htmlFor="apellidos" className="text-sm font-medium">
                                                Apellidos
                                            </label>
                                            <input
                                                type="text"
                                                value={cognoms}
                                                placeholder="Introduzca sus apellidos"
                                                onChange={(e) => setCognoms(e.target.value)}
                                                className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                                            />
                                            {cognomsError && <p className="text-red-500 text-xs italic">{cognomsErrorMessages}</p>}
                                        </div>
                                        {/*Fecha nacimiento */}
                                        <div className={`space-y-1 ${dataError ? 'text-red-500' : ''}`}>
                                            <label htmlFor="fecha" className="text-sm font-medium">
                                                Fecha de nacimiento
                                            </label>
                                            <input
                                                type="date"
                                                value={data}
                                                onChange={(e) => setData(e.target.value)}
                                                className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                                            />
                                            {dataError && <p className="text-red-500 text-xs italic">{dateErrorMessages}</p>}
                                        </div>
                                        {/*Universidad */}
                                        <div className={`space-y-1 ${universityError ? 'text-red-500' : ''}`}>
                                            <label htmlFor="universidad" className="text-sm font-medium">
                                                Universidad
                                            </label>
                                            <select
                                                id="university"
                                                className={`block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-blue-500 ${universityError ? 'border-red-500' : ''}`}
                                                value={selectedUniversity}
                                                onChange={(e) => {
                                                    setSelectedUniversity(e.target.value);
                                                    validateUniversity();
                                                }}
                                            >
                                                <option value="" disabled>
                                                    Selecciona tu universidad
                                                </option>
                                                {universities.map((uni) => (
                                                    <option key={uni.id} value={uni.id}>
                                                        {uni.name}
                                                    </option>
                                                ))}
                                                <option value="no-listed">Mi universidad no aparece</option>
                                                <option value="no-university">No voy a la universidad</option>
                                            </select>
                                            {universityError && <p className="text-red-500 text-xs italic">{universityErrorMessage}</p>}
                                        </div>
                                        {/*Email */}
                                        <div className={`space-y-1 ${emailError ? 'text-red-500' : ''}`}>
                                            <label htmlFor="email" className="text-sm font-medium">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                placeholder="Introduzca su email"
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                                            />
                                            {emailError && <p className="text-red-500 text-xs italic">{emailErrorMessage}</p>}
                                        </div>
                                        {/*Contraseña */}
                                        <div className={`space-y-1 ${passwordError ? 'text-red-500' : ''}`}>
                                            <label htmlFor="password" className="text-sm font-medium">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    placeholder="************"
                                                    onChange={(e) => { setPassword(e.target.value) }}
                                                    className="block w-full rounded-lg border border-gray-200 px-5 py-3 leading-6 placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400 dark:focus:border-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                                >
                                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                                </button>
                                                {passwordError && <p className="text-red-500 text-xs italic">{passwordErrorMessages}</p>}
                                            </div>
                                        </div>
                                        {/*Si hay algun error enviado desde backend, se pondra en el componente ErrorMessage */}
                                        {errorMessages && <ErrorMessage message={errorMessages} />}
                                        {/*Boton submit */}
                                        <div>
                                            <button
                                                type="submit"
                                                className="inline-flex w-full items-center justify-center space-x-2 rounded-lg border border-blue-700 bg-blue-700 px-6 py-3 font-semibold leading-6 text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring focus:ring-blue-400 focus:ring-opacity-50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-opacity-90"
                                                isLoading={isSubmitting}
                                                onClick={validateParameters}
                                                disabled={emailError || passwordError || nomError || cognomsError || dataError || universityError}
                                            >
                                                <span>Entrar</span>
                                            </button>
                                            <div className="grid grid-cols-2 gap-2">
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="grow bg-gray-50 p-5 text-center text-sm md:px-16 dark:bg-gray-700/50">
                                    Ya tienes una cuenta?
                                    <button
                                        onClick={navigateToLogIn}
                                        className="font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Log in
                                    </button>
                                </div>

                            </div>
                            )}

                            {/* Acaba formulario sing in */}
                        </section>
                        {/* Aacaba seccion sing in */}
                    </div>
                </main>
                {/* Aacaba pagina */}
            </div>
            {/* Acaba container */}
            

        </>
    );



}