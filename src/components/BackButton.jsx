import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

//Boton para dirigirnos hacia tras en la navegacion general.
export default function BackButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="text-gray-200 hover:text-gray-500 transition duration-150 ease-in-out"
        >
            <FaArrowLeft className="text-2xl" />
        </button>
    );
};

