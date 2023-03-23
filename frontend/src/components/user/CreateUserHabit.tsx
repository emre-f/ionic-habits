import React, { useState, useEffect, useRef } from 'react'
import { useErrorMessage } from "../../components/ErrorMessage";
import CONSTANTS from '../../constants'

const App: React.FC<any> = ({ user }) => {
    interface NewHabit {
        name: string,
        unitName: string;
        unitMin: string,
        unitMax: string,
        notes: string
    }

    const [newHabitInfo, setNewHabitInfo] = useState<NewHabit>({
        name: "",
        unitName: "",
        unitMin: "0",
        unitMax: "0",
        notes: "",
    });

    function toCamelCase(text: string): string {
        let updatedText = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');

        return updatedText;
    }

    function updateHabitInfo(name: string, value: any) {
        if (name === "habitName") { name = "name" }

        setNewHabitInfo(prevHabitInfo => ({
            ...prevHabitInfo,
            [name]: value,
        }));
    }

    const createHabit = async () => {

        // turn unitmin and unitmax into int!

        console.log(newHabitInfo)
    }

    return (
        <div className="user-info-container">
            <h2 className="title" style={{ marginBottom: '20px' }}> Create New Habit </h2>
            <div style={{ maxWidth: '325px', textAlign: 'left' }}>
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr style={{ marginBottom: '10px' }}>
                            <td> Habit Name*: </td>
                            <td style={{ width: '50%' }}>
                                <input className="italic habit-input" type="text" placeholder="Reading"
                                    onChange={(e: any) => updateHabitInfo("name", e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr style={{ marginBottom: '10px' }}>
                            <td> Unit Name*: </td>
                            <td style={{ width: '50%' }}>
                                <input className="italic habit-input" type="text" placeholder="Pages"
                                    onChange={(e: any) => updateHabitInfo("unitName", e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr style={{ marginBottom: '10px' }}>
                            <td> Unit Min*: </td>
                            <td style={{ width: '50%' }}>
                                <input className="italic habit-input" type="text" placeholder="0"
                                    onChange={(e: any) => updateHabitInfo("unitMin", e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr style={{ marginBottom: '10px' }}>
                            <td> Unit Max*: </td>
                            <td style={{ width: '50%' }}>
                                <input className="italic habit-input" type="text" placeholder="40"
                                    onChange={(e: any) => updateHabitInfo("unitMax", e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr style={{ marginBottom: '10px' }}>
                            <td> Notes: </td>
                            <td style={{ width: '50%' }}>
                                <input className="italic habit-input" type="text" placeholder="Only books count!"
                                    onChange={(e: any) => updateHabitInfo("notes", e.target.value)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={{textAlign: 'center', marginTop: '20px'}}>
                    <button onClick={createHabit} id='createUserButton'>
                        Create Habit
                    </button>
                    <p style={{margin: '0', fontStyle: 'italic', fontSize: '14px', marginTop: '2px'}}>
                        * Required
                    </p>
                </div>
            </div>
        </div>
    )
};

export default App