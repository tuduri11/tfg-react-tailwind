import React from 'react';

const TokenSymbol = () => {
  return (
    // Reduce aún más el tamaño del div contenedor para hacer el círculo amarillo más pequeño
    <div className="flex items-center justify-center bg-yellow-500 text-white rounded-full h-4 w-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        // Ajusta el tamaño del SVG para que se ajuste al nuevo tamaño del contenedor
        className="w-3 h-3" // Este tamaño del SVG puede ajustarse para mantener la proporción deseada dentro del círculo más pequeño
      >
        {/* Ajuste el strokeWidth para hacer el trazo adecuado al tamaño reducido */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={4} // Mantener o ajustar según la visibilidad y el diseño deseado
          d="M12 4.354a4 4 0 100 15.292M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>
  );
};

export default TokenSymbol;
