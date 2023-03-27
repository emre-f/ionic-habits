import React, { useState, useEffect, useRef } from 'react'
import { useErrorMessage } from "../../components/ErrorMessage";
import CONSTANTS from '../../constants'

const App: React.FC<any> = ({ user, habit }) => {
    const { handleMessage } = useErrorMessage();

    interface NewRecord {
        value: string,
        date: string
    }

    const [newRecordInfo, setNewRecordInfo] = useState<NewRecord>({
        value: "",
        date: "",
    });

    const createRecord = async () => {
        // If user is null return error
        if (!user) {
            handleMessage("User not found");
            return;
        }

        // If habit is null return error
        if (!habit) {
            handleMessage("Habit not found");
            return;
        }

        // Make sure value is entered
        if (newRecordInfo.value === "") {
            handleMessage("Please enter a value");
            return;
        }

        let numValue = Number(newRecordInfo.value);

        // Make sure value is a number
        if (isNaN(numValue)) {
            handleMessage("Value must be a number");
            return;
        }

        // Make sure value is between unit min and unit max
        if (numValue < habit.unitMin || numValue > habit.unitMax) {
            handleMessage("Value must be between unit min and unit max");
            return;
        }

        // If value contains only a decimal, can only have 1 decimal point
        if (newRecordInfo.value.split('.').length > 1 && newRecordInfo.value.split('.')[1].length > 1) {
            handleMessage("Value can only have 1 decimal point");
            return;
        }

        // Make sure there is a date
        if (newRecordInfo.date === "") {
            handleMessage("Please enter a date");
            return;
        }

        // Check if date is valid
        let date = new Date(newRecordInfo.date);
        let userTimezoneOffset = date.getTimezoneOffset() * 60000; // Correct for timezone differences
        date = new Date(date.getTime() + userTimezoneOffset * Math.sign(userTimezoneOffset));

        if (date.toString() === "Invalid Date") {
            handleMessage("Date is invalid");
            return;
        }

        // Date can't be before 2023, or in the future
        if (date.getFullYear() < 2023 || date > new Date()) {
            handleMessage("Date must be after 2023 and not in the future");
            return;
        }
        
        var finalRecord = {
            value: numValue,
            date: date
        }

        // Create record
        var good_response = false;
        var caught_error = {
            'status': "",
            'message': ""
        }

        await fetch(`${CONSTANTS.API_URL}/users/${user._id}/habits/${habit._id}/records/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalRecord)
        })
        .then((response) => {
            good_response = response.status === 200;
            if (!good_response) {
                caught_error.status = String(response.status);
                caught_error.message = response.statusText;
            }
        })
        .catch((error) => {
            handleMessage('Error: ' + error);
            return;
        });

        // Refresh page
        if (good_response) {
            // window.location.reload();
        } else {
            handleMessage(`Error ${caught_error.status}: ${caught_error.message}`);
        }
    }

    return (
        <div className="user-info-container">
            <h2 className="title" style={{ marginBottom: '20px' }}> Create New Record </h2>
            <div style={{ maxWidth: '360px', textAlign: 'left' }}>
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr style={{ marginBottom: '10px' }}>
                            <td> Value*: </td>
                            <td style={{ width: '50%' }}>
                                <input className="italic habit-input" type="text" placeholder="100"
                                    onChange={
                                        (e: any) => setNewRecordInfo(prev => {
                                            const newValue = e.target.value;
                                            const newDate = prev.date ?? '';
                                            return { value: newValue, date: newDate };
                                        })
                                    }
                                />
                            </td>
                        </tr>

                        <tr style={{ marginBottom: '10px' }}>
                            <td> Date*: </td>
                            <td style={{ width: '50%' }}>
                                <input className="italic habit-input" type="date"
                                    onChange={
                                        (e: any) => setNewRecordInfo(prev => {
                                            const newValue = prev.value ?? '';
                                            const newDate = e.target.value;
                                            return { value: newValue, date: newDate };
                                        })
                                    }
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={{textAlign: 'center', marginTop: '20px'}}>
                    <button onClick={createRecord} id='createRecordButton'>
                        Create Record
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