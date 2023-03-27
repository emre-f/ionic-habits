import React, { useState, useEffect, useRef } from 'react'
import { useErrorMessage } from "../ErrorMessage";
import CONSTANTS from '../../constants'

const App: React.FC<any> = ({ user, habit }) => {
    const { handleMessage } = useErrorMessage();

    // To edit records
    const [popupId, setPopupId] = useState<string>("");
    const [oldValue, setOldValue] = useState<string>("");

    const editRecord = async (recordId: string, oldValue: string) => {
        if (popupId !== "") {
            setPopupId("");
            return;
        }

        setPopupId(recordId);
        setOldValue(oldValue);
    }

    const sendEdit = async () => {
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

        // If popupId is null return error
        if (popupId === "") {
            handleMessage("Record not found");
            return;
        }

        var link = `${CONSTANTS.API_URL}/users/${user._id}/habits/${habit._id}/records/${popupId}`;

        var good_response = false;
        var caught_error = {
            'status': "",
            'message': ""
        }

        var newValue = Number((document.getElementById("edit-value") as HTMLInputElement).value);

        await fetch(link, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                value: newValue
            })
        }).then(response => {
            good_response = response.status === 200;
            if (!good_response) {
                caught_error.status = String(response.status);
                caught_error.message = response.statusText;
            }
        }).catch(error => {
            handleMessage('Error: ' + error);
            return;
        });

        // Refresh page
        if (good_response) {
            window.location.reload();
        } else {
            handleMessage(`Error ${caught_error.status}: ${caught_error.message}`);
        }
    }


    const editArea = () => {
        if (popupId === "") { return null }

        return (
            <div className="edit-area">
                Edit value to
                &nbsp;
                <input style={{ width: '10%' }} type="text" id="edit-value" defaultValue={oldValue} />
                &nbsp;
                <button style={{ padding: '4px', fontSize: '0.8em' }} onClick={sendEdit}>
                    Submit
                </button>
            </div>
        )
    };

    /////////////////////////////

    // Describe record object
    type Record = {
        [key: string]: any;
    };

    const deleteRecord = async (recordId: String) => {
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

        var link = `${CONSTANTS.API_URL}/users/${user._id}/habits/${habit._id}/records/${recordId}`;
        console.log(link)
        var good_response = false;
        var caught_error = {
            'status': "",
            'message': ""
        }

        await fetch(link, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            good_response = response.status === 200;
            if (!good_response) {
                caught_error.status = String(response.status);
                caught_error.message = response.statusText;
            }
        }).catch(error => {
            handleMessage('Error: ' + error);
            return;
        });

        // Refresh page
        if (good_response) {
            window.location.reload();
        } else {
            handleMessage(`Error ${caught_error.status}: ${caught_error.message}`);
        }
    }

    const sortedRecords = [...habit.records].sort((a, b) => {
        return new Date(b.date) > new Date(a.date) ? -1 : 1; // Sort by date earliest->latest
    });

    const recordsTableHeader = () => {
        if (habit.records.length === 0) {
            return (
                <p style={{ color: '#707070', fontStyle: 'italic' }}> No records found </p>
            )
        } else {
            return (
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '44%', textAlign: 'left', color: '#707070' }}> Date </th>
                            <th style={{ width: '44%', textAlign: 'right', color: '#707070' }}> Value </th>
                            <th style={{ width: '12%', textAlign: 'right', color: '#707070' }}> </th>
                        </tr>
                    </thead>
                </table>
            )
        }
    };

    return (
        <div className="user-info-container">
            <h2 className="title" style={{ marginBottom: '20px' }}> Records </h2>
            <div>
                {recordsTableHeader()}
                <table style={{ width: '100%' }} >
                    <tbody>
                        {sortedRecords.map((record: Record) => (

                            <tr key={CONSTANTS.GENERATE_ID()}>
                                <td style={{ width: '44%', textAlign: 'left' }}>
                                    {record.date.substring(0, 10)}
                                </td>
                                <td style={{ width: '44%', textAlign: 'right' }}>
                                    {record.value}
                                </td>
                                <td style={{ width: '12%', textAlign: 'right' }}>
                                    <a onClick={() => { editRecord(`${record._id}`, `${record.value}`) }}>
                                        &#9998;
                                    </a>
                                    &nbsp;
                                    <a onClick={() => { deleteRecord(`${record._id}`) }}>
                                        &#128465;
                                    </a>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>

            {editArea()}
        </div>
    )
};

export default App