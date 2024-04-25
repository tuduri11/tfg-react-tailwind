import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { getAccessToken, getRefreshToken } from "../session"
import Cookies from 'js-cookie'
import { SERVER_DNS } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

export default function Dropdown() {
  const navigate = useNavigate(); // Hook para la navegación
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para manejar el envío
  const [errorMessages, setErrorMessages] = useState(''); // Estado para manejar los mensajes de error


  const navigateToPerfil = () => {
    navigate('/edit-profile');
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateToStatistics = () => {
    navigate('/statistics');
  };

  const navigateToFavourites = () => {
    navigate('/favourites');
  };

  async function logOut() {
    let access = await getAccessToken()
    let response = await fetch(`${SERVER_DNS}/accounts/logout`,
      {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({ 'access': access, 'refresh': getRefreshToken() }),
        headers: {
          'Authorization': `Bearer ${access}`,
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .catch((error) => {
        setIsSubmitting(false)
        setErrorMessages('Something went wrong')
      })

    const { success, msg } = await response
    setIsSubmitting(false)
    if (success) {
      Cookies.remove('access_token')
      Cookies.remove('refresh_token')
      setIsSubmitting(false)
      localStorage.removeItem('chatMessages');
      //Si el logout es correcto, nos redirige al login otra vez.
      navigateToLogin()
    }
    else {
      setErrorMessages(msg)
    }
  }
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex items-center justify-center rounded-md bg-transparent p-2 text-white hover:bg-white hover:bg-opacity-20">
          <FaUser className="h-5 w-5" /> {/* Icono de usuario */}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute md:right-0 md:origin-top-right z-10 mt-2 w-40  divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item className="hover:bg-slate-300">
            <button
                className="group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-900"
                onClick={navigateToPerfil} // Vinculando el evento onClick
              >
                Perfil
              </button>
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item className="hover:bg-slate-300">
            <button
                className="group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-900"
                onClick={navigateToFavourites} // Vinculando el evento onClick
              >
                Favoritos
              </button>
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item className="hover:bg-slate-300">
            <button
                className="group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-900"
                onClick={navigateToStatistics} // Vinculando el evento onClick
              >
                Estadísticas
              </button>
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item className="hover:bg-slate-300">
              {({ active }) => (
                <button
                  className="group flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-900"
                  onClick={logOut} // Vinculando el evento onClick
                >
                  Log out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
