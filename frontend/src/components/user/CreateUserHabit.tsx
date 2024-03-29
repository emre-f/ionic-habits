import React, { useState, useEffect, useRef } from 'react'
import { useErrorMessage } from "../../components/ErrorMessage";
import CONSTANTS from '../../constants'

const App: React.FC<any> = ({ user }) => {
    const { handleMessage } = useErrorMessage();

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

        // If user is null return error
        if (!user) {
            handleMessage("User not found");
            return;
        }

        // If new habit name is empty, return
        if (newHabitInfo.name === "") {
            handleMessage("Please enter a habit name");
            return;
        }

        if (newHabitInfo.unitName === "") {
            handleMessage("Please enter a unit name");
            return;
        }

        // Habit can't be longer than 20 characters
        if (newHabitInfo.name.length > 20 || newHabitInfo.unitName.length > 20) {
            handleMessage("Names must be less than 20 characters");
            return;
        }

        // Habit can only have alphabet characters or space
        const regex = /^[a-zA-Z ]+$/;
        if (!regex.test(newHabitInfo.name) || !regex.test(newHabitInfo.unitName)) {
            handleMessage("Names can only contain letters or space");
            return;
        }

        // Unit min and unit max must be numbers
        if (isNaN(Number(newHabitInfo.unitMin)) || isNaN(Number(newHabitInfo.unitMax))) {
            handleMessage("Unit min and unit max must be numbers");
            return; 
        }

        // If they contain a decimal, can only have 1 decimal point 
        if (newHabitInfo.unitMin.split('.').length > 1 && newHabitInfo.unitMin.split('.')[1].length > 1) {
            handleMessage("Unit min can only have 1 decimal point");
            return;
        }
        if (newHabitInfo.unitMax.split('.').length > 1 && newHabitInfo.unitMax.split('.')[1].length > 1) {
            handleMessage("Unit max can only have 1 decimal point");
            return;
        }
        
        // Unit min has to be less than unit max
        if (Number(newHabitInfo.unitMin) >= Number(newHabitInfo.unitMax)) {
            handleMessage("Unit min must be less than unit max");
            return;
        }

        // Notes can only have alphabet characters, numbers, or space
        const regex2 = /^[a-zA-Z0-9 ]+$/;
        if (newHabitInfo.notes.length > 0 && !regex2.test(newHabitInfo.notes)) {
            handleMessage("Notes can only contain letters, numbers, or space");
            return;
        }

        // Notes can't be longer than 100 characters
        if (newHabitInfo.notes.length > 100) {
            handleMessage("Notes must be less than 100 characters");
            return;
        }
        
        // Turn unit min & max into numbers
        var finalHabit = {
            name: newHabitInfo.name,
            unitName: newHabitInfo.unitName,
            unitMin: Number(newHabitInfo.unitMin),
            unitMax: Number(newHabitInfo.unitMax),
            notes: newHabitInfo.notes
        }

        // Create habit
        await fetch(`${CONSTANTS.API_URL}/users/${user._id}/habits/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalHabit)
        }).catch((error) => {
            handleMessage('Error: ' + error);
            return;
        });

        // Refresh page
        window.location.reload();
    }

    return (
        <div className="user-info-container">
            <h2 className="title" style={{ marginBottom: '20px' }}> Create New Habit </h2>
            <div style={{ maxWidth: '360px', textAlign: 'left' }}>
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
                    <button onClick={createHabit} id='createHabitButton'>
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