import React, { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';

const SuccessMessage = ({ message }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Desaparece después de 4 segundos
        const timeoutId = setTimeout(() => {
            setShow(false);
        }, 4000);

        // Limpieza en caso de que el componente se desmonte antes
        return () => clearTimeout(timeoutId);
    }, []);

    if (!show) return null;

    return (
        <div className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex items-center justify-center w-12 bg-green-500">
                {/* Ícono de verificación */}
                <FaCheck className="text-white text-2xl" />
            </div>

            <div className="px-4 py-2 -mx-3">
                <div className="mx-3">
                    <span className="font-semibold text-green-500 dark:text-green-400">Éxito</span>
                    <p className="text-sm text-gray-600 dark:text-gray-200">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SuccessMessage;