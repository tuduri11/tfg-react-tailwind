
import React, { createContext, useState, useContext, useEffect } from 'react';
import { isAuthenticated, getAccessToken } from '../session';
import { SERVER_DNS } from './constants';
import { useLocalStorage } from './localStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mathys, setMathys] = useState(0);

    const [isPremium, setIsPremium] = useLocalStorage('isPremium', false);

    useEffect(() => {
        isAuthenticated()
            .then(res => {
                setIsLoggedIn(res);
                if (res) {
                    fetchMathys();
                }
            })
            .catch(error => console.error('Error checking authentication:', error));
    }, []);


    // Función para obtener los Mathys del usuario desde el backend
    const fetchMathys = async () => {
        const accessToken = await getAccessToken();
        fetch(`${SERVER_DNS}/accounts/get-mathys`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setMathys(data.msg); // Actualiza el estado con los Mathys obtenidos
                } else {
                    console.error('Error al cargar los Mathys:', data.msg);
                }
            })
            .catch(error => console.error('Error en la red:', error));
    };

    // Función para actualizar los Mathys del usuario en el backend
    const updateMathys = async (newMathys) => {
        const accessToken = await getAccessToken();
        fetch(`${SERVER_DNS}/accounts/update-mathys`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mathys: newMathys }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setMathys(data.msg); // Actualiza el estado con el nuevo valor de Mathys
                } else {
                    console.error('Error al actualizar los Mathys:', data.msg);
                }
            })
            .catch(error => console.error('Error en la red:', error));
    };




    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, mathys, setMathys,fetchMathys, updateMathys, isPremium, setIsPremium }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
