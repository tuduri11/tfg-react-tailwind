import { useState, useMemo, useEffect, useCallback } from "react";
import useEffectWithoutFirstRun from '../../utils/useEffectWithoutFirstRun'; 
import { calculateAge } from '../../utils/dateUtils';
import { SERVER_DNS } from '../../utils/constants';
import ErrorMessage from '../../components/ErrorMessage'
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


    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorMessages, setpasswordErrorMessages] = useState('')

    const [terms, setTerms] = useState(false)
    const [errorTerms, setErorTerms] = useState(false)
    const [errorMessages, setErrorMessages] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const current = new Date();
    const currentDate = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;

 
    //Validations
    const validateEmail = useCallback(() => {
        const mailformat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi
        if (email === '') {
            setEmailErrorMessage('Email is required')
            setEmailError(true)
        }
        else if (email.match(mailformat) == null) {
            setEmailErrorMessage('Invalid email format')
            setEmailError(true)
        }
        else {
            setEmailErrorMessage('')
            setEmailError(false)
        }
    }, [email])


    const validateNom = useCallback(() => {
        if (nom === '') {
            setNameErrorMessages('Name is required');
            setNomError(true);
        } else if (nom.match(/^[A-Za-z]+$/) === null) {
            setNameErrorMessages('Name can\'t contain numbers');
            setNomError(true);
        } else {
            setNomError(false);
        }
        console.log('validate nom')
    }, [nom])


    const validateCognoms = useCallback(() => {
        console.log('validate cognom')
        if (cognoms === '') {
            setCognomsErrorMessages('Surname is required');
            setCognomsError(true);
        } else if (cognoms.match(/[0-9]+/) != null) {
            setCognomsErrorMessages('Surname is incorrect');
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
            setDateErrorMessages('Date is required')
            setDataError(true)
        } else if (date >= current) {
            setDateErrorMessages('You\'re not from the future');
            setDataError(true);
        } else if (calculateAge(date, current) < 18) {
            setDateErrorMessages('You must be of legal age');
            setDataError(true);
        }
        else {
            setDataError(false)
            setDateErrorMessages('')
        }

    }, [data])

    const validatePassword = useCallback(() => {
        if (password.length < 8) {
            setpasswordErrorMessages('Minimum 8 characters');
            setPasswordError(true);
        }
        else if (password.match(/(?=.*?[A-Z])/) == null) {
            setpasswordErrorMessages("At least one uppercase letter");
            setPasswordError(true);
        }
        else if (password.match(/(?=.*?[a-z])/) == null) {
            setpasswordErrorMessages("At least one lowercase letter");
            setPasswordError(true);
        }
        else if (password.match(/(?=.*?[0-9])/) == null) {
            setpasswordErrorMessages("At least one digit");
            setPasswordError(true);
        }
        else if (password.match(/(?=.*?[#?.,!@$%^&*-])/) == null) {
            setpasswordErrorMessages("At least one special character");
            setPasswordError(true);
        }
        else {
            setPasswordError(password === '')

        }
    }, [password])

    


    const validateParameters = useCallback(() => {
        validateEmail()
        validateData()
        validateCognoms()
        validateNom()
        validatePassword()
        setErorTerms(!terms)
    }, [validateEmail, validatePassword, validateNom, validateCognoms, validateData, terms])

    useEffectWithoutFirstRun(validateEmail, [email])
    useEffectWithoutFirstRun(validatePassword, [password])
    useEffectWithoutFirstRun(validateData, [data])
    useEffectWithoutFirstRun(validateNom, [nom])
    useEffectWithoutFirstRun(validateCognoms, [cognoms])
    useEffectWithoutFirstRun(() => setErorTerms(!terms), [terms])

    const navigate = useNavigate();
    const navigateToLogIn = () => {
        navigate('/login');

    };

    useEffect(() => {
        fetch(`${SERVER_DNS}/education/get-universities`) // Asegúrate de que la URL es correcta
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

    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessages('')
        if (!emailError && !passwordError && !nomError && !cognomsError && !dataError) {
          setIsSubmitting(true)
          console.log('Submitted')
          let jsonData = { "email": email, "password": password, "name": nom, "surname": cognoms, "university": selectedUniversity, "birthdate": data}
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
            const {success, msg} = await response
            setIsSubmitting(false)
            if(success){
              setIsRegistered(true)
            }
            else{
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
        <div className="flex justify-center items-center p-5">
            <div className="p-8 max-w-md w-full border rounded-lg shadow-lg bg-white">
                <div className="text-center">
                    <h2 className="text-lg font-semibold">{isRegistered ? 'Registered' : 'Register'}</h2>
                </div>

                {isRegistered ? (
                    <div className="text-center">
                        <p>{email} registered!</p>
                        <button
                            className="mt-4 px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition"
                            onClick={() => navigate('/')}
                        >
                            Home
                        </button>
                    </div>
                ) : (
                    <div className="mt-4 text-left">
                        <form onSubmit={handleSubmit}>
                            {/* Campos del formulario aquí, ejemplo: */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {nomError && (
                                    <p className="mt-2 text-sm text-red-600">{nameErrorMessages}</p>
                                )}
                            </div>
                            {/* Repite para otros campos... */}

                            {errorMessages && <ErrorMessage message={errorMessages} />}
                            <div className="text-center">
                                <button
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                                    type="submit"
                                    disabled={emailError || passwordError || nomError || cognomsError || dataError || errorTerms}
                                >
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );


}