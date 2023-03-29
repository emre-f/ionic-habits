import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import ErrorMessage from './components/ErrorMessage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from 'react-auth-kit'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AuthProvider authType={'cookie'}
            authName={'_auth'}
            cookieDomain={window.location.hostname}
            // cookieSecure={window.location.protocol === "https:"}
            cookieSecure={false} // development only, not using https
        >

            <BrowserRouter>
                <ErrorMessage>
                    <App />
                </ErrorMessage>
            </BrowserRouter>
            
        </AuthProvider>
    </React.StrictMode>,
)
