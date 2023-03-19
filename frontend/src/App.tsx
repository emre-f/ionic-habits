import { useState } from 'react'
import ionicHabitsLogo from '/logo.svg'
import './App.css'
import ErrorMessage from './components/ErrorMessage';
import CheckBackend from './components/CheckBackend'
import ListAllUsers from './components/ListAllUsers'
import SearchUser from './components/SearchUser'

const App: React.FC = () => {
    return (
        <div className="App">
            <ErrorMessage>
                <div style={{ padding: '1em' }}>
                    <img src={ionicHabitsLogo} className="logo" alt="Ionic Habits logo" />
                    <h1 className='title'>Ionic Habits</h1>
                </div>
                
                <CheckBackend />

                <ListAllUsers />

                <SearchUser />
            </ErrorMessage>
        </div>
    )
}

export default App
