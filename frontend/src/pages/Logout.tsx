import { useState, useEffect } from 'react'
import { useErrorMessage } from "../components/ErrorMessage";
import { useNavigate } from 'react-router-dom'
import CONSTANTS from '../constants'
import { useSignOut } from 'react-auth-kit'

function App() {
    const signOut = useSignOut()
    const navigate = useNavigate();

    // do this once
    useEffect(() => {
        // Upon reaching this page, log out and return to '/'
        signOut()
        navigate('/')
    }, [])

    return (
        <div>
            <h1>Logout</h1>
        </div>
    )
}

export default App