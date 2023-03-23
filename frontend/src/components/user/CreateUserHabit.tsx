import { useState } from 'react'
import { useErrorMessage } from "../../components/ErrorMessage";
import CONSTANTS from '../../constants'

const App: React.FC<any> = ({ user }) => {
    interface NewHabit {
        name: string,
        unitName: string;
        unitMin: number,
        unitMax: number,
        notes: string
    }

    return (
        <div className="user-info-container">
            <h2 className="title" style={{ marginBottom: '20px' }}> Create New Habit </h2>
        </div>
    )
};

export default App