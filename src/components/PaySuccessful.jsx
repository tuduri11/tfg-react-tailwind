import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle } from 'react-icons/ai'; // Importa un ícono de verificación

const PaySuccessful = ({ successMessage, detailMessage }) => {
    const navigate = useNavigate()

    const navigateToExercices = () => {
        navigate('/universidades');
    }

    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center">
            <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 align-middle max-w-lg w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                            <AiOutlineCheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                {successMessage}
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    {detailMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" onClick={navigateToExercices} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                        ¡Empezar!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaySuccessful;
