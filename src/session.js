import { ACCESS_TOKEN_EXPIRE_TIME, SERVER_DNS } from "./utils/constants";
import Cookies from 'js-cookie'

export async function getAccessToken()
{ 
  const refresh = getCookie('refresh_token')
  if(!refresh.valid){
    return Promise.reject("Not logged in")
  }
  const access = getCookie('access_token')
  if(access.valid){
    return Cookies.get('access_token')
  }
  else{
    const response = fetch(`${SERVER_DNS}/accounts/refresh-token`,
    {
      method:'POST',
      mode:'cors',
      // credentials: "include",
      body: JSON.stringify({'refresh':refresh.value}),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .catch(e=>{return Promise.reject(("Unknown error"))})

    const {access} = await response
    const expires = new Date(new Date().getTime() + ACCESS_TOKEN_EXPIRE_TIME)
    Cookies.set('access_token', access, { expires: expires, sameSite: 'Lax' })
    return access
  }
}

export const getRefreshToken = () =>{ return Cookies.get('refresh_token') }
export async function isAuthenticated(){
  let access = await getAccessToken().catch(e=>{return undefined})

  return  access !== 'undefined' && typeof access !== 'undefined'
}

export function getCookie(name){
  let value = Cookies.get(name)
  //console.log('cokkie',name,value)
  return {'value':value, 'valid':(value !== 'undefined' && typeof value !== 'undefined')}
}