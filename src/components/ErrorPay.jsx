import React, { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const ErrorPay = ({ errorMessage}) => {
    const navigate = useNavigate()

    const navigateToPremium = ()=> {
        navigate('/premium');
    }

    const navigateToInicio = ()=> {
        navigate('/universidades');
    }

    if (!errorMessage) return null;

    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center">
            <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 align-middle max-w-lg w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-2 ">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <AiOutlineCloseCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Error de Pago
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    {errorMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" onClick={navigateToInicio} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Cerrar
                    </button>
                    <button type="button" onClick={navigateToPremium} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Intentar de nuevo
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ErrorPay;