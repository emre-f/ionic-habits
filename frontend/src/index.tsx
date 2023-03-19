import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import ErrorMessage from './components/ErrorMessage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <ErrorMessage>
                <App />
            </ErrorMessage>
        </BrowserRouter>
    </React.StrictMode>,
)
