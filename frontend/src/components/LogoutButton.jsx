import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
const LogoutButton = ({children}) => {

    const { logout } = useAuthStore();

    const handleLogout = async() =>{
       await logout();
    }

  return (
    <button className='btn btn-primary' onClick={handleLogout}>
        {children}
    </button>
    
  )
}

export default LogoutButton