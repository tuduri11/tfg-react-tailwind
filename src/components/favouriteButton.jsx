import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fasFaHeart } from '@fortawesome/free-solid-svg-icons'; // Corazón relleno
import { faHeart as farFaHeart } from '@fortawesome/free-regular-svg-icons'; // Corazón vacío

const FavouriteButton = ({ isFavourite, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 text-red-500 hover:text-red-600"
        >
            {isFavourite ? (
                <FontAwesomeIcon icon={fasFaHeart} size="2x" />
            ) : (
                <FontAwesomeIcon icon={farFaHeart} size="2x" />
            )}
        </button>
    );
};

export default FavouriteButton;