import React, { useState, useEffect, useRef } from 'react';
import { TbRobot, TbX } from 'react-icons/tb';
import { MdSend } from 'react-icons/md';
import { SERVER_DNS } from '../utils/constants';
import { getAccessToken } from '../session';
import { useAuth } from '../utils/AuthContext';


export default function ChatBot() {

    const { mathys, setMathys } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    //Obtenemos los mensajes anteriores guardados en localstorage. Si no hay mensajes nuevos, saldra el mensaje predeterminado.
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [
            {
                message: "Hola, soy CHATHY! Preguntame cualquier duda!",
                sender: "ChatGPT"
            }
        ];
    });
    const lastMessageRef = useRef(null); // Crea una referencia para el último mensaje
    const [newMessage, setNewMessage] = useState('');

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        if (isLoggedIn === false) {
            // Añade un mensaje de error al chat
            const errorMessage = {
                message: "Debes iniciar sesión para usar el chat.",
                sender: "Error" // Utiliza un remitente especial para el mensaje de error
            };
            setMessages([...messages, errorMessage]);
        }

        // Comprueba si hay suficientes "mathys" antes de enviar el mensaje
        else if (mathys <= 0) {
            // Añade un mensaje de error al chat
            const errorMessage = {
                message: "No tienes suficientes mathys.",
                sender: "Error" // Utiliza un remitente especial para el mensaje de error
            };
            setMessages([...messages, errorMessage]);
        }
        else {
            const userMessage = {
                message: newMessage,
                sender: "user"
            };

            setMessages([...messages, userMessage]);
            setNewMessage('');
            let token = await getAccessToken();
            //Backend espera un objeto con la estructura { message: "texto"}
            const response = await fetch(`${SERVER_DNS}/accounts/chatgpt`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: newMessage, sender: "user" })
            });

            const { message, user_mathys } = await response.json();
            //Recibimos los mathys del backend y actualizamos los mathys del contexto.
            setMathys(user_mathys)
            setMessages(messages => [...messages, { message, sender: "ChatGPT" }]);
        };
    }

    // Efecto para almacenar los mensajes en localStorage cada vez que cambian
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
        //Para no sobrellenar el localstorage, cuando hay mas de 30 mensajes, los vamos remplazando.
        if (messages.length > 30) {
            const lastThirtyMessages = messages.slice(-30);
            setMessages(lastThirtyMessages);
            localStorage.setItem('chatMessages', JSON.stringify(lastThirtyMessages));
        }
    }, [messages]);

    // Efecto para desplazar hacia el último mensaje después de cualquier actualización de mensajes
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Controlador para detectar la tecla Enter y enviar el mensaje
    const handleKeyDown = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Previene el comportamiento por defecto del Enter (nueva línea o envío de formulario)
            await handleSend();
        }
    };


    return (
        <div className="fixed right-10 bottom-10 flex flex-col items-end z-10">
            {isExpanded ? (
                <div className="w-full md:w-96 bg-white rounded-lg shadow-lg transition duration-150 ease-in-out transform translate-y-0">
                    <div className="bg-blue-400 text-white text-lg font-semibold p-2 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <TbRobot size="24" className="mr-2" /><span>CHATHY</span>
                        </div>
                        <button onClick={() => setIsExpanded(false)} className="rounded-full p-2 hover:bg-blue-500 transition duration-150 ease-in-out">
                            <TbX size="24" className="text-white" />
                        </button>
                    </div>

                    <div className="overflow-y-auto h-64 p-4 space-y-2">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                                <div className={`relative rounded-lg px-4 py-2 ${msg.sender === "Error" ? "bg-red-500 text-white" : msg.sender === "ChatGPT" ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"}`}
                                    ref={index === messages.length - 1 ? lastMessageRef : null}>
                                    {msg.message}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center p-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 p-2 border-2 border-gray-300 rounded focus:outline-none"
                            placeholder="Escribe tu duda aquí..."
                        />
                        <button onClick={handleSend} className="ml-2 text-white bg-blue-400 rounded-full p-2 hover:bg-blue-500 focus:outline-none">
                            <MdSend size="24" />
                        </button>
                    </div>
                </div>
            ) : (
                <button onClick={() => {
                    setIsExpanded(true);
                    // Agrega un pequeño retraso para asegurar que el estado se haya actualizado y el chat esté visible
                    setTimeout(() => {
                        if (lastMessageRef.current) {
                            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
                        }
                    }, 100);
                }} className="text-white bg-blue-400 rounded-full p-3 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-150 ease-in-out mb-3">
                    <TbRobot size="33" />
                </button>
            )}
        </div>

    );
}