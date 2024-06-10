import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { SERVER_DNS } from '../../utils/constants';
import { getAccessToken } from '../../session';
import { isAuthenticated } from '../../session';
import LoadingComponent from '../../components/LoadingComponent';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../utils/AuthContext';
import EmptyList from '../../components/EmptyList';
import toast from 'react-hot-toast';
import NotFoundComponent from '../../components/NotFoundComponent';
import ErrorState from '../../components/ErrorState';
import FavouriteButton from '../../components/favouriteButton';
import NoFavourites from '../../components/NoFavourites';


export default function Favourites() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, seterrorMessage]= useState('');
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    //Obtener la lista de los ejercicios favoritos al entrar en el componente.
    useEffect(() => {
        async function getFavourites() {
            setLoading(true)
            try {
                let logged = await isAuthenticated()
                if (!logged) {
                    navigate('/login');
                    return;
                }
                let token = await getAccessToken()
                let response = await fetch(`${SERVER_DNS}/favourites/get-favourites`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                })
                const data = await response.json()
                if (data.success) {
                    setProblems(data.favourites.map(favourite => ({
                        ...favourite.problem_details
                    })))
                } else {
                    console.error('Error getting favorites: ', data.msg);
                    seterrorMessage(data.msg)
                    setProblems([])
                }
            } catch (error) {
                seterrorMessage('Error al obtener favoritos.')
                console.error('Error getting favorites: ', error)

            } finally {
                setLoading(false)
            }
        }

        getFavourites();
    }, [])

    //Funcion para marcar si un ejercicio es favorito o no.
    const toggleFavourite = async (problemSlug, index) => {
        try {
            let token = await getAccessToken();
            let response = await fetch(`${SERVER_DNS}/favourites/addFavourites/${problemSlug}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                let updatedProblems = [...problems];
                updatedProblems[index].isFavourite = data.isFavourite;
                setProblems(updatedProblems);
                toast.success(data.msg, {
                    style: {
                        border: '1px solid #10b981',
                        padding: '16px',
                        color: '#FFFFFF',
                        backgroundColor: '#1A202C',
                    },
                    iconTheme: {
                        primary: '#10b981',
                        secondary: '#2D3748',
                    },
                });
            } else {
                toast.error(data.msg, {
                    style: {
                        border: '1px solid #E53E3E', 
                        padding: '16px',
                        color: '#FFFFFF', 
                        backgroundColor: '#1A202C', 
                    },
                    iconTheme: {
                        primary: '#E53E3E', 
                        secondary: '#FFFFFF', 
                    }
                });
                throw new Error(data.msg || 'Error al cambiar el estado de favorito');
            }
        } catch (error) {
            toast.error('Error al cambiar el estado de favorito.', {
                style: {
                    border: '1px solid #E53E3E', 
                    padding: '16px',
                    color: '#FFFFFF', 
                    backgroundColor: '#1A202C', 
                },
                iconTheme: {
                    primary: '#E53E3E', 
                    secondary: '#FFFFFF', 
                }
            });
        }
    }

    const handleSelectProblem = (problemSlug) => {
        // Navega a la ruta de la carrera seleccionada
        navigate(`/problemas/${problemSlug}`);
    };


    if (loading) {
        return <LoadingComponent></LoadingComponent>
    }
    if (errorMessage){
        return <ErrorState errorMessage={errorMessage}></ErrorState>
    }

    if (problems.length === 0){
        return <NoFavourites></NoFavourites>
    }

    return (
        <div className="overflow-auto bg-gray-900 text-white min-h-screen ">
            <div className="mx-auto max-w-5xl p-5 sm:p-3">
                <h1 className="text-3xl font-bold text-center mb-6">Tus problemas favoritos</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {problems.map((problem, index) => (
                        <div
                            key={problem.id}
                            className="transform hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer rounded-lg overflow-hidden shadow-lg"
                            onClick={() => handleSelectProblem(problem.slug)}
                        >
                            <div className="bg-white dark:bg-gray-800 p-6 flex flex-col justify-between h-full">
                                <h3 className="text-md text-center md:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {problem.name}
                                </h3>
                                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">{problem.description || "No description available."}</p>
                                <div>
                                    {isLoggedIn && (
                                        <FavouriteButton isFavourite={problem.isFavourite} onClick={(e) => { e.stopPropagation(); toggleFavourite(problem.slug, index); }}></FavouriteButton>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}