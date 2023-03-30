import { useState, useEffect } from 'react'
import { useErrorMessage } from "../components/ErrorMessage";
import { useNavigate } from 'react-router-dom'
import CONSTANTS from '../constants'
import { useSignOut } from 'react-auth-kit'

function App() {
    const signOut = useSignOut()
    const navigate = useNavigate();

    // Currently after logout react-auth-kit keeps the cookies, so must be removed manually
    const removeAuthCookies = () => {

        function removeCookiesByName(name: string): void {
            const cookies = document.cookie.split(";");

            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const [cookieName, cookieValue] = cookie.split("=");

                if (cookieName.includes(name.trim())) {
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                }
            }
        }

        removeCookiesByName('auth')
    }

    // do this once
    useEffect(() => {
        // Upon reaching this page, log out and return to '/'
        signOut()
        removeAuthCookies()
        navigate('/')
    }, [])

    return (
        <div>
            <h1>Logout</h1>
        </div>
    )
}

export default App