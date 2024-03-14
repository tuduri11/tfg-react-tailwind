import React from 'react';
import { useAuth } from '../../utils/AuthContext';
import ChatBot from '../../components/chatBot';


export default function Home() {
  const { mathys, updateMathys } = useAuth();

  const handleAction = () => {
    // Suponiendo que cada acción reduce los Mathys en uno
    const newMathys = mathys - 1;
    updateMathys(newMathys); // Actualiza los Mathys en el contexto y en el backend
  };

  return (
    <div id="page-container" className="mx-auto flex min-h-dvh w-full min-w-[320px] flex-col bg-gray-100 dark:bg-gray-900">
      {/* Tu lógica de componente */}
      <button onClick={handleAction}>Realizar Acción</button>
      <ChatBot></ChatBot>
    </div>
  );
};
