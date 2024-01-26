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
            <div className="container relative mx-auto flex flex-col space-y-16 px-4 py-16 text-center lg:flex-row lg:space-y-0 lg:px-8 lg:py-32 lg:text-left xl:max-w-7xl">
              <div className="lg:flex lg:w-1/2 lg:items-center">
                <div>
                  <h1 className="mb-4 text-4xl font-black text-black dark:text-white">
                    Bienvenidos
                    <span className="text-blue-600 dark:text-blue-500">
                      Universitarios
                    </span>
                  </h1>
                  <h2 className="text-xl font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                  Resuelve ejercicios de matemáticas de forma rápida y eficiente con nuestra herramienta automatizada diseñada para estudiantes universitarios
                  </h2>
                  <div className="flex flex-col justify-center space-y-2 pb-16 pt-10 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0 lg:justify-start">
                    <a
                      href="/Register"
                      className="inline-flex items-center justify-center space-x-2 rounded-lg border border-blue-700 bg-blue-700 px-7 py-3.5 font-semibold leading-6 text-white hover:border-blue-600 hover:text-white focus:ring focus:ring-blue-400 focus:ring-opacity-50 active:border-blue-700 active:bg-blue-700 dark:focus:ring-blue-400 dark:focus:ring-opacity-90 hover:bg-blue-500 hover:delay-300"
                    >
                      <span>Regístrate</span>
                    </a>
                    <a
                      href="/about-us"
                      className="inline-flex items-center justify-center space-x-2 rounded-lg border border-gray-200 bg-white px-7 py-3.5 font-semibold leading-6 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700"
                    >
                      <span>Sobre Nosotros</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="lg:ml-16 lg:flex lg:w-1/2 lg:items-center lg:justify-center">
                <div className="relative mx-5 lg:w-96">
                  <div className="bg-tranparent absolute left-0 top-0 -ml-20 -mt-16 size-40 rounded-full border border-blue-200 lg:size-72 dark:border-blue-900" />
                  <div className="bg-tranparent absolute left-0 top-0 -ml-14 -mt-20 size-40 rounded-full border border-blue-100 lg:size-72 dark:border-blue-950" />
                  <div className="bg-tranparent absolute bottom-0 right-0 -mb-16 -mr-20 size-40 rounded-full border border-blue-200 lg:size-72 dark:border-blue-900" />
                  <div className="bg-tranparent absolute bottom-0 right-0 -mb-20 -mr-14 size-40 rounded-full border border-blue-100 lg:size-72 dark:border-blue-950" />
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
