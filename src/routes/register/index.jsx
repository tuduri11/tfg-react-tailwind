import { useState, useMemo, useEffect, useCallback } from "react";
import useEffectWithoutFirstRun from '../../utils/useEffectWithoutFirstRun';
import { calculateAge } from '../../utils/dateUtils';
import { SERVER_DNS } from '../../utils/constants';
import ErrorMessage from '../../components/ErrorMessage'
import { FiEye, FiEyeOff } from 'react-icons/fi';
import React from 'react';
import { Routes, Route, useNavigate, redirect } from 'react-router-dom'



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
            let jsonData = { "email": email, "password": password, "name": nom, "surname": cognoms, "university": universityValue, "birthdate": data }
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
        <div className="register-form flex justify-center items-center p-5">
            <div className="p-8 max-w-sm border rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-xl font-semibold">{isRegistered ? 'Registrado!' : 'Register'}</h1>

                </div>
                {/*Una vez registrado, sale este mensaje confirmando que todo ha ido bien. Hay boton para volver al inicio. */}
                {isRegistered ? (
                    <div className="text-center">
                        <p>Bienvenido {nom}! Muchas gracias por registrarte en nuestra página web!</p>
                        <button
                            className="mt-4 bg-orange-500 text-white w-full rounded py-2"
                            onClick={() => navigate('/')}
                        >
                            Inicio
                        </button>
                    </div>
                ) : (
                    <div className="mt-4 text-left">
                        <form onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <div className={`mb-4 ${nomError ? 'text-red-500' : ''}`}>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                                <input
                                    type="text"
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                    className={`shadow appearance-none border ${nomError ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                />
                                {nomError && <p className="text-red-500 text-xs italic">{nameErrorMessages}</p>}
                            </div>

                            <div className={`mb-4 ${cognomsError ? 'text-red-500' : ''}`}>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Apellidos</label>
                                <input
                                    type="text"
                                    value={cognoms}
                                    onChange={(e) => setCognoms(e.target.value)}
                                    className={`shadow appearance-none border ${cognomsError ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                />
                                {cognomsError && <p className="text-red-500 text-xs italic">{cognomsErrorMessages}</p>}
                            </div>
                            <div className={`mb-4 ${dataError ? 'text-red-500' : ''}`}>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Fecha de nacimiento</label>
                                <input
                                    type="date"
                                    value={data}
                                    onChange={(e) => setData(e.target.value)}
                                    className={`shadow appearance-none border ${dataError ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                />
                                {dataError && <p className="text-red-500 text-xs italic">{dateErrorMessages}</p>}
                            </div>
                            {/* En universidad, cogemos las universidades de la base de datos y añadimos dos opciones para si no esta la universidad o si el user no va.*/}
                            <div className={`mb-4 ${universityError ? 'text-red-500' : ''}`}>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Universidad</label>
                                <select
                                    id="university"
                                    className={`select w-full max-w-xs border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${universityError ? 'border-red-500' : ''}`}
                                    value={selectedUniversity}
                                    onChange={(e) => {
                                        setSelectedUniversity(e.target.value);
                                        validateUniversity();
                                    }}
                                    placeholder="Selecciona la teva universitat"

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
                            <div className={`mb-4 ${emailError ? 'text-red-500' : ''}`}>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`shadow appearance-none border ${emailError ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                />
                                {emailError && <p className="text-red-500 text-xs italic">{emailErrorMessage}</p>}
                            </div>
                            <div className={`mb-4 ${passwordError ? 'text-red-500' : ''}`}>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    >

                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {passwordError && <p className="text-red-500 text-xs italic">{passwordErrorMessages}</p>}
                            </div>
                            {/*Si hay algun error enviado desde backend, se pondra en el componente ErrorMessage */}
                            {errorMessages && <ErrorMessage message={errorMessages} />}


                            {/* Submit Button */}
                            <div className="text-center">
                                <button
                                    type="submit"
                                    isLoading={isSubmitting}
                                    onClick={validateParameters}
                                    className={`mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
                    ${emailError || passwordError || nomError || cognomsError || dataError || universityError ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={emailError || passwordError || nomError || cognomsError || dataError || universityError}
                                >
                                    Regístrate!
                                </button>
                            </div>

                            {/* Login Link */}
                            <div className="mt-4 text-center">
                                <p>
                                    Do you have an account?
                                    <button
                                        className="ml-2 text-blue-500 hover:text-blue-800 font-bold"
                                        onClick={navigateToLogIn}
                                    >
                                        Log In
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );



}