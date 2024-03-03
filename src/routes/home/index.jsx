import React from 'react';
import { useAuth } from '../../utils/AuthContext';


export default function Home() {
  const { mathys, updateMathys } = useAuth();

  const handleAction = () => {
    // Suponiendo que cada acción reduce los Mathys en uno
    const newMathys = mathys - 1;
    updateMathys(newMathys); // Actualiza los Mathys en el contexto y en el backend
  };

  return (
    <div>
      {/* Tu lógica de componente */}
      <button onClick={handleAction}>Realizar Acción</button>
    </div>
  );
};
