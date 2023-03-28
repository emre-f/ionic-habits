import { useState, useEffect } from 'react';
import { useErrorMessage } from "../../components/ErrorMessage";
import React from 'react';
import CONSTANTS from '../../constants';

const App: React.FC<any> = ({ user, habit }) => {
    const { handleMessage } = useErrorMessage();

    // Describe habit object
    type Habit = {
        [key: string]: any;
    };

    const [currentHabitInfo, setCurrentHabitInfo] = useState<Habit>({
        name: habit.name,
        unitName: habit.unitName,
        unitMax: String(habit.unitMax),
        unitMin: String(habit.unitMin),
        notes: habit.notes
    });

    function updateHabitInfo(name: string, value: any) {
        if (name === "habitName") { name = "name" }

        setCurrentHabitInfo(prevHabitInfo => ({
            ...prevHabitInfo,
            [name]: value,
        }));
    }

    const editHabit = async () => {
        // If user is null return error
        if (!user) {
            handleMessage("User not found");
            return;
        }

        // If new habit name is empty, return
        if (currentHabitInfo.name === "") {
            handleMessage("Please enter a habit name");
            return;
        }

        if (currentHabitInfo.unitName === "") {
            handleMessage("Please enter a unit name");
            return;
        }

        // Habit can't be longer than 20 characters
        if (currentHabitInfo.name.length > 20 || currentHabitInfo.unitName.length > 20) {
            handleMessage("Names must be less than 20 characters");
            return;
        }

        // Habit can only have alphabet characters or space
        const regex = /^[a-zA-Z ]+$/;
        if (!regex.test(currentHabitInfo.name) || !regex.test(currentHabitInfo.unitName)) {
            handleMessage("Names can only contain letters or space");
            return;
        }

        // Unit min and unit max must be numbers
        if (isNaN(Number(currentHabitInfo.unitMin)) || isNaN(Number(currentHabitInfo.unitMax))) {
            handleMessage("Unit min and unit max must be numbers");
            return; 
        }

        // If they contain a decimal, can only have 1 decimal point 
        if (currentHabitInfo.unitMin.split('.').length > 1 && currentHabitInfo.unitMin.split('.')[1].length > 1) {
            handleMessage("Unit min can only have 1 decimal point");
            return;
        }
        if (currentHabitInfo.unitMax.split('.').length > 1 && currentHabitInfo.unitMax.split('.')[1].length > 1) {
            handleMessage("Unit max can only have 1 decimal point");
            return;
        }
        
        // Unit min has to be less than unit max
        if (Number(currentHabitInfo.unitMin) >= Number(currentHabitInfo.unitMax)) {
            handleMessage("Unit min must be less than unit max");
            return;
        }

        // Notes can only have alphabet characters, numbers, or space
        const regex2 = /^[a-zA-Z0-9 ]+$/;
        if (currentHabitInfo.notes.length > 0 && !regex2.test(currentHabitInfo.notes)) {
            handleMessage("Notes can only contain letters, numbers, or space");
            return;
        }

        // Notes can't be longer than 100 characters
        if (currentHabitInfo.notes.length > 100) {
            handleMessage("Notes must be less than 100 characters");
            return;
        }
        
        // Turn unit min & max into numbers
        var finalHabit = {
            name: currentHabitInfo.name,
            unitName: currentHabitInfo.unitName,
            unitMin: Number(currentHabitInfo.unitMin),
            unitMax: Number(currentHabitInfo.unitMax),
            notes: currentHabitInfo.notes
        }

        await fetch(`${CONSTANTS.API_URL}/users/${user._id}/habits/${habit._id}`, {
            method: 'PATCH',
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
            <h2 className="title" style={{ marginBottom: '20px' }}> Edit Habit </h2>
            <div>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <td style={{ textAlign: 'left' }}> Habit Name: </td>
                            <td style={{ width: '50%', textAlign: 'right' }}>
                                <input type="text" defaultValue={habit.name} 
                                onChange={(e: any) => updateHabitInfo("name", e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}> Unit Name: </td>
                            <td style={{ width: '50%', textAlign: 'right' }}>
                                <input type="text" defaultValue={habit.unitName} 
                                onChange={(e: any) => updateHabitInfo("unitName", e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}> Unit Min: </td>
                            <td style={{ width: '50%', textAlign: 'right' }}>
                                <input type="text" defaultValue={habit.unitMin} 
                                onChange={(e: any) => updateHabitInfo("unitMin", e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}> Unit Max: </td>
                            <td style={{ width: '50%', textAlign: 'right' }}>
                                <input type="text" defaultValue={habit.unitMax} 
                                onChange={(e: any) => updateHabitInfo("unitMax", e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}> Notes: </td>
                            <td style={{ width: '50%', textAlign: 'right' }}>
                                <input type="text" defaultValue={habit.notes} 
                                onChange={(e: any) => updateHabitInfo("notes", e.target.value)} />
                            </td>
                        </tr>
                    </thead>
                </table>

                <div style={{textAlign: 'center', marginTop: '20px'}}>
                    <button onClick={editHabit}>
                        Edit Habit
                    </button>
                </div>
            </div>
        </div>

    )
}

export default App