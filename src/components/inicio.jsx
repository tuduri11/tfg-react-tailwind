import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import image from "../assets/matematica_0.jpg"

export default function Inicio() {
  return (
    <>
        {/* Hero Section: Image Side with Simple Header */}
        <div className="relative overflow-hidden bg-white dark:bg-gray-900 dark:text-gray-100">
            {/* Main Header */}
            {/* END Main Header */}
            {/* Hero Content */}
            <div className="container relative mx-auto flex flex-col space-y-8 px-4 py-8 text-center lg:flex-row lg:space-y-0 lg:px-8 lg:py-16 lg:text-left xl:max-w-7xl">
                <div className="lg:flex lg:w-1/2 lg:items-center">
                    <div>
                        <h1 className="mb-4 text-3xl font-black text-black dark:text-white sm:text-4xl lg:text-5xl">
                            Bienvenidos
                            <span className="block text-blue-600 dark:text-blue-500">
                                Universitarios
                            </span>
                        </h1>
                        <h2 className="text-lg font-medium leading-relaxed text-gray-700 dark:text-gray-300 sm:text-xl lg:text-2xl">
                            Resuelve ejercicios de matemáticas de forma rápida y eficiente con nuestra herramienta automatizada diseñada para estudiantes universitarios.
                        </h2>
                        <div className="flex flex-col justify-center space-y-2 pb-8 pt-6 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0 lg:justify-start">
                            <a
                                href="/Register"
                                className="inline-flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 hover:bg-purple-600 px-5 py-3 font-semibold leading-6 text-white hover:text-white transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-100 lg:px-7 lg:py-3.5"
                            >
                                <span>Regístrate</span>
                            </a>
                            <a
                                href="/about-us"
                                className="inline-flex items-center justify-center space-x-2 rounded-lg border border-gray-200 bg-white px-5 py-3 font-semibold leading-6 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-100 lg:px-7 lg:py-3.5"
                            >
                                <span>Sobre Nosotros</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="lg:ml-16 lg:flex lg:w-1/2 lg:items-center lg:justify-center">
                    <div className="relative mx-5 lg:w-96">
                        <div className="bg-transparent absolute left-0 top-0 -ml-20 -mt-16 h-40 w-40 rounded-full border border-blue-200 lg:h-72 lg:w-72 dark:border-blue-900" />
                        <div className="bg-transparent absolute left-0 top-0 -ml-14 -mt-20 h-40 w-40 rounded-full border border-blue-100 lg:h-72 lg:w-72 dark:border-blue-950" />
                        <div className="bg-transparent absolute bottom-0 right-0 -mb-16 -mr-20 h-40 w-40 rounded-full border border-blue-200 lg:h-72 lg:w-72 dark:border-blue-900" />
                        <div className="bg-transparent absolute bottom-0 right-0 -mb-20 -mr-14 h-40 w-40 rounded-full border border-blue-100 lg:h-72 lg:w-72 dark:border-blue-950" />
                        <div className="absolute inset-0 -m-6 -rotate-2 rounded-xl bg-gray-200 dark:bg-gray-800" />
                        <div className="absolute inset-0 -m-6 rotate-1 rounded-xl bg-blue-800 bg-opacity-75 shadow-inner dark:bg-blue-900 dark:bg-opacity-75" />
                        <img
                            src={image}
                            className="relative mx-auto rounded-lg shadow-lg"
                            alt="Hero Image"
                        />
                    </div>
                </div>
            </div>
            {/* END Hero Content */}
        </div>
        {/* END Hero Section: Image Side with Simple Header */}
    </>
);
}
