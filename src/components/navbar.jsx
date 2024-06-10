import React, { useState, useEffect } from 'react';
import Dropdown from './dropdown';
import { isAuthenticated } from '../session';
import logo from "../assets/MathCampus-logos_transparent_navbar.png"
import { useAuth } from '../utils/AuthContext';
import MathySymbol from './MathySymbol';

//Items para ver cuando no se esta logueado
const defaultItems = [
    {
        slug: "/universidades/",
        anchor: "EJERCICIOS"
    },
    {
        slug: "/about-us/",
        anchor: "SOBRE NOSOTROS"
    },
    {
        slug: "/premium/",
        anchor: "PREMIUM"
    },
    {
        slug: "/login/",
        anchor: "LOG IN"
    },
    {
        slug: "/register/",
        anchor: "REGÍSTRATE"
    }

];

//Items de cuando estamos logueados
const otherItems = [
    {
        slug: "/universidades/",
        anchor: "EJERCICIOS"
    },
    {
        slug: "/premium/",
        anchor: "PREMIUM"
    },
    {
        slug: "/about-us/",
        anchor: "SOBRE NOSOTROS"
    }

];


export default function Navbar() {

    const [isOpen, setIsOpen] = useState(false);
    const { mathys } = useAuth();

    const { isLoggedIn } = useAuth();
    //Si el usuario está loged se enseñan "Others items", sino se enseñan defaultItems.

    const [items, setItems] = useState([])
    useEffect(() => {
        setItems(!isLoggedIn
            ?
            defaultItems
            : otherItems
        )

    }, [isLoggedIn])


    return (
        <nav className="opacity-4 relative bg-white shadow dark:bg-gray-800">
            <div className="container px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
                <div className="flex items-center justify-between">
                    <a href="/universidades" className="flex items-center">
                        <img className="w-auto h-12 sm:h-15 md:h-12" src={logo} alt="Logo" />
                    </a>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400" aria-label="toggle menu">
                            {isOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`${isOpen ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full'} absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center`}>
                    <div className="flex flex-col md:flex-row md:mx-6 md:items-center">
                        {items.map((item, index) => (
                            <a
                                key={index}
                                href={item.slug}
                                className={`my-2 md:my-0 transition-all duration-300 transform md:mx-2 px-3 py-1 rounded-md uppercase font-bold ${item.anchor === "REGÍSTRATE" || item.anchor === "LOG IN" ? "tracking-wide text-sm md:text-xs" : "text-sm"
                                    } ${item.anchor === "REGÍSTRATE" ?
                                        "text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:bg-purple-600" :
                                        item.anchor === "LOG IN" ?
                                            "whitespace-nowrap text-white bg-gradient-to-r from-teal-500 to-teal-700 hover:bg-teal-600" :
                                            "whitespace-nowrap text-gray-200 hover:text-blue-500"
                                    }`}
                            >
                                {item.anchor}
                            </a>
                        ))}
                    </div>

                    {isLoggedIn && <div><Dropdown /></div>}
                    {isLoggedIn && (
                        <div className="flex items-center">
                            <span className="text-white font-bold mr-2">{mathys}</span> <MathySymbol />
                        </div>
                    )}


                </div>
            </div>
        </nav>
    );
};