import React from 'react';
import { useAuth } from '../../utils/AuthContext';
import { URL_STRIPE_PREMIUM } from '../../utils/constants';
import { useLocalStorage } from '../../utils/localStorage';

export default function Premium() {

  const [email, setEmail] = useLocalStorage('email', '');
  const { isLoggedIn } = useAuth();
  const { isPremium } = useAuth();

  return (
    <div className="relative overflow-hidden dark:bg-gray-900">
      <div className="bg-gray-900 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20 ">
        <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
          <div>
            <p className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-white uppercase rounded-full bg-gradient-to-r from-teal-400 to-teal-600">
              Premium
            </p>
          </div>
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-white   sm:text-4xl md:mx-auto">
            Potencia tu aprendizaje. ¡Hazte premium!
          </h2>
          <p className="text-base text-gray-200 md:text-lg">
            Mejora tu experiencia. Hazte premium y disfruta de 300 "Mathys" al mes. ¡Únete ahora!
          </p>
        </div>
        <div className=" grid gap-10 row-gap-5 sm:row-gap-10 lg:grid-cols-2">
          <div className=" bg-gray-300 flex flex-col justify-between p-5 border rounded-lg shadow-lg">
            <div className="mb-6">
              <div className="flex items-center justify-between pb-6 mb-6 border-b">
                <div>
                  <p className="text-sm font-bold tracking-wider uppercase">
                    Uso Básico
                  </p>
                  <p className="text-4xl font-extrabold">Gratis</p>
                </div>
              </div>
              <p className="mb-2 font-bold tracking-wide">Características</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="mr-2">
                    <svg className="w-4 h-4 text-teal-500" viewBox="0 0 24 24" strokeLinecap="round" strokeWidth="2">
                      <polyline fill="none" stroke="currentColor" points="6,12 10,16 18,8" />
                      <circle cx="12" cy="12" fill="none" r="11" stroke="currentColor" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-800">10 Mathys mensuales*</p>
                </li>
              </ul>
            </div>
            {!isLoggedIn ? (
              <a
                href="/Register" // Asegúrate de que esta ruta sea correcta
                className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-gradient-to-r from-teal-500 to-teal-700 hover:bg-teal-600 focus:shadow-outline focus:outline-none ease-in-out transform hover:-translate-y-1 hover:scale-100"
              >
                Regístrate y comience gratis
              </a>
            ) : isPremium ? (
              <p className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-gradient-to-r from-purple-500 to-purple-700 hover:bg-purple-600 focus:shadow-outline focus:outline-none">
                Usted ya es premium
              </p>
            ) : (
              <p className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-gradient-to-r from-gray-800 to-gray-900 hover:bg-gray-700 focus:shadow-outline focus:outline-none">
                Usted tiene el modo básico
              </p>
            )}
            <p className="mt-2 text-sm text-gray-600">
              *Cada Mathy es una llamada a Chathy o una solución de un ejercicio.
            </p>
          </div>
          <div className=" bg-gray-300 flex flex-col justify-between p-5  border rounded-lg shadow-lg">
            <div className="mb-6">
              <div className="flex items-center justify-between pb-6 mb-6 border-b">
                <div>
                  <p className="text-sm font-bold tracking-wider uppercase">
                    Premium
                  </p>
                  <p className="text-4xl font-extrabold">19,99€</p>
                </div>
              </div>
              <p className="mb-2 font-bold tracking-wide">Características</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="mr-2">
                    <svg className="w-4 h-4 text-teal-500" viewBox="0 0 24 24" strokeLinecap="round" strokeWidth="2">
                      <polyline fill="none" stroke="currentColor" points="6,12 10,16 18,8" />
                      <circle cx="12" cy="12" fill="none" r="11" stroke="currentColor" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-800">300 Mathys mensuales*</p>
                </li>
              </ul>
            </div>
            {!isLoggedIn ? (
              <a
                href="/Register"
                className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-gradient-to-r from-purple-500 to-purple-700 hover:bg-purple-600 focus:shadow-outline focus:outline-none ease-in-out transform hover:-translate-y-1 hover:scale-100"
              >
                Regístrate y Hazte Premium
              </a>
            ) : isPremium ? (
              <p className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-gradient-to-r from-purple-500 to-purple-700 hover:bg-purple-600 focus:shadow-outline focus:outline-none">
                Usted ya es premium
              </p>
            ) : (
              <a
                href={`${URL_STRIPE_PREMIUM}?prefilled_email=${email}`} //URL de enlace de pago de Stripe
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-gradient-to-r from-purple-500 to-purple-700 hover:bg-purple-600 focus:shadow-outline focus:outline-none ease-in-out transform hover:-translate-y-1 hover:scale-100">
                Hazte Premium
              </a>
            )}

            <p className="mt-2 text-sm text-gray-600">
              *Cada Mathy es una llamada a Chathy o una solución de un ejercicio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
