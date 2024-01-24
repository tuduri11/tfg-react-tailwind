import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserIcon } from '@heroicons/react/20/solid';
import { getAccessToken, getRefreshToken} from "../session"
import Cookies from 'js-cookie'
import { SERVER_DNS} from '../utils/constants';
import { useNavigate } from 'react-router-dom';

export default function Dropdown() {
  const navigate = useNavigate(); // Hook para la navegación
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para manejar el envío
  const [errorMessages, setErrorMessages] = useState(''); // Estado para manejar los mensajes de error


  async function logOut() {
    let access = await getAccessToken()
    let response = fetch(`${SERVER_DNS}/accounts/logout`,
      {
        method: 'POST',
        mode: 'cors',
        body: { 'access': access, 'refresh': getRefreshToken() },
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
      //Si el logout es correcto, nos redirige al login otra vez.
      navigate('/login')
    }
    else {
      setErrorMessages(msg)
    }
  }
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {/* A continuación, se muestra cómo aplicar las clases directamente */}
            <Menu.Item>
              <a href="/edit-perfil" className="block px-4 py-2 text-sm text-gray-700">
                Editar perfil
              </a>
            </Menu.Item>
            {/* Repite esto para cada Menu.Item */}
          </div>
          {/* ... otros Menu.Items ... */}
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
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
