import React, { useState, useEffect, useRef } from 'react'
import { useErrorMessage } from "../../components/ErrorMessage";
import CONSTANTS from '../../constants'

const App: React.FC<any> = ({ user, habit }) => {
    const { handleMessage } = useErrorMessage();

    const [dateToDelete, setdateToDelete] = useState("");

    const deleteRecord = async () => {
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

        // Make sure there is a date
        if (dateToDelete === "") {
            handleMessage("Please enter a date");
            return;
        }

        // Check if date is valid
        let date = new Date(dateToDelete);
        let userTimezoneOffset = date.getTimezoneOffset() * 60000; // Correct for timezone differences
        date = new Date(date.getTime() + userTimezoneOffset * Math.sign(userTimezoneOffset));
        console.log("INPUT DATE: " + date)
        return
        if (date.toString() === "Invalid Date") {
            handleMessage("Date is invalid");
            return;
        }

        // From all the records of the habit, see if the date matches any and set it to the ID if u can
        let recordID = "";
        for (let i = 0; i < habit.records.length; i++) {
            let recordDate = new Date(habit.records[i].date);
            let userTimezoneOffset = recordDate.getTimezoneOffset() * 60000; // Correct for timezone differences
            recordDate = new Date(recordDate.getTime() + userTimezoneOffset * Math.sign(userTimezoneOffset));
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
            <h2 className="title" style={{ marginBottom: '20px' }}> Delete Record </h2>
            <div style={{ maxWidth: '360px', textAlign: 'left' }}>
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr style={{ marginBottom: '10px' }}>
                            <td> Date*: </td>
                            <td style={{ width: '50%' }}>
                                <input className="italic habit-input" type="date"
                                    onChange={(e: any) => setdateToDelete(e.target.value)}
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