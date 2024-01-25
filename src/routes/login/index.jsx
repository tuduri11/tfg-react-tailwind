import React from 'react';
import { useState, useEffect, useCallback } from "react";
import { SERVER_DNS, ACCESS_TOKEN_EXPIRE_TIME } from '../../utils/constants';
import ErrorMessage from '../../components/ErrorMessage'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../../utils/localStorage'
import Cookies from 'js-cookie'
import { isAuthenticated } from "../../session"
import Navbar from "../../components/navbar"
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {

  const [email, setEmail] = useLocalStorage('email', '');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { isAuthenticated().then(res => setIsLoggedIn(res)) }, []);


  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessages('')
    if (!emailError && !passwordError) {
      setIsSubmitting(true)
      console.log('Submitted')
      let jsonData = { "email": email, "password": password }
      let response = fetch(`${SERVER_DNS}/accounts/login`,
        {
          method: 'POST',
          mode: 'cors',
          // credentials: "include",
          body: JSON.stringify(jsonData),
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(response => {
          return response.json()
        })
        .catch((error) => {
          setIsSubmitting(false)
          setErrorMessages('Something went wrong')
        })

      const { success, msg, refresh, access } = await response
      // const {success, msg, token} = await response
      setIsSubmitting(false)
      if (success) {
        //localStorage.setItem('csrftoken',token)
        setIsLoggedIn(true)
        const expires = new Date(new Date().getTime() + ACCESS_TOKEN_EXPIRE_TIME)
        Cookies.set('access_token', access, { expires: expires, sameSite: 'Lax' })
        Cookies.set('refresh_token', refresh, { sameSite: 'Lax' })
        navigate('/home');
      }
      else {
        setErrorMessages(msg)
      }
    }
    else {
      setErrorMessages("Porfavor introduzca parametros válidos.")
      setIsSubmitting(false)
    }
  };

  const navigateToRegister = () => {
    navigate('/register');
  };



  //Validations
  const validateEmail = useCallback(() => {
    console.log('validate email')
    setEmailError(email === '')
  }, [email])

  const validatePassword = useCallback(() => {
    setPasswordError(password === '')
  }, [password])

  const validateParameters = useCallback(() => {
    validateEmail()
    validatePassword()
  }, [validateEmail, validatePassword])


  return (
    <>
      <div><Navbar></Navbar></div>
      {/* Pages: Sign In: Boxed */}

      {/* Page Container */}
      <div
        id="page-container"
        className="mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
      >
        {/* Page Content */}
        <main id="page-content" className="flex max-w-full flex-auto flex-col">
          <div className="relative mx-auto flex min-h-dvh w-full max-w-10xl items-center justify-center overflow-hidden p-4 lg:p-8">
            {/* Sign In Section */}
            <section className="w-full max-w-xl py-6">
              {/* Header */}
              <header className="mb-10 text-center">
                <h1 className="mb-2 inline-flex items-center space-x-2 text-2xl font-bold">

                  <span>INICIA SESIÓN</span>
                </h1>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bienvenido, porfavor inicia sesión!
                </h2>
              </header>
              {/* END Header */}

              {/* Sign In Form */}
              <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800 dark:text-gray-100">
                <div className="grow p-5 md:px-16 md:py-12">
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                      {!emailError ? null : (<p className="text-red-500 text-xs italic">El email es requerido</p>)}
                    </div>
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
                        {!passwordError ? null : (<p className="text-red-500 text-xs italic">La contraseña es requerida</p>)}
                      </div>
                    </div>
                    {/*Si hay algun error enviado desde backend, se pondra en el componente ErrorMessage */}
                    {errorMessages && <ErrorMessage message={errorMessages} />}
                    <div>
                      <button
                        type="submit"
                        className="inline-flex w-full items-center justify-center space-x-2 rounded-lg border border-blue-700 bg-blue-700 px-6 py-3 font-semibold leading-6 text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring focus:ring-blue-400 focus:ring-opacity-50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-opacity-90"
                        isLoading={isSubmitting}
                        onClick={validateParameters}
                        isDisabled={emailError || passwordError}
                      >
                        <span>Entrar</span>
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                      </div>
                    </div>
                  </form>
                </div>
                <div className="grow bg-gray-50 p-5 text-center text-sm md:px-16 dark:bg-gray-700/50">
                  Aun no tienes una cuenta?
                  <button
                    onClick={navigateToRegister}
                    className="font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Regístrate
                  </button>
                </div>
              </div>
              {/* END Sign In Form */}
            </section>
            {/* END Sign In Section */}
          </div>
        </main>
        {/* END Page Content */}
      </div>
      {/* END Page Container */}

      {/* END Pages: Sign In: Boxed */}
    </>
  );
}
