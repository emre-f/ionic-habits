import { useState } from 'react'
import ionicHabitsLogo from '/logo.svg'
import './App.css'
import CheckBackend from './components/CheckBackend'
import ListAllUsers from './components/ListAllUsers'

function App() {
    return (
        <div className="App">
            <div>
                <img src={ionicHabitsLogo} className="logo" alt="Ionic Habits logo" />
                <h1 className='title'>Ionic Habits</h1>
            </div>
            
            <CheckBackend />

            <ListAllUsers />

            #TODO SEARCH FOR A USER

            <div className="card">
                <input type="text" value="" placeholder="username"/>
      
                <button>
                    Search User
                </button>
            </div>
        </div>
    )
}

export default App
