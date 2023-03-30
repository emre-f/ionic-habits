import React from 'react';
import '../../styles/Toggle.css';
import { useAuthUser } from 'react-auth-kit'

const App: React.FC<any> = ({ user, habit, editMode, setEditMode }) => {
    // Get first and last date
    const [firstDate, setFirstDate] = React.useState<String>("");
    const [lastDate, setLastDate] = React.useState<String>("");
    const auth = useAuthUser();

    const handleToggle = () => {
        setEditMode((prevEditMode: Boolean) => !prevEditMode);
    };

    // Describe habit object
    type Record = {
        [key: string]: any;
    };

    // Do this only once when component is loaded
    React.useEffect(() => {
        // Sort the records of the habit by date
        habit.records.sort((a: Record, b: Record) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        if (habit.records.length > 0) {
            const firstRecord = new Date(habit.records[0].date);
            const firstDate = `${firstRecord.toLocaleString('default', { month: 'short' })} ${firstRecord.getDate()}, ${firstRecord.getFullYear()}`;

            const lastRecord = new Date(habit.records[habit.records.length - 1].date);
            const lastDate = `${lastRecord.toLocaleString('default', { month: 'short' })} ${lastRecord.getDate()}, ${lastRecord.getFullYear()}`;

            setFirstDate(firstDate);
            setLastDate(lastDate);
        }

    }, []);

    return (
        <div className="user-info-container">
            <h2 className="title" style={{ marginBottom: '20px' }}> Summary </h2>
            <div>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <td style={{ textAlign: 'left' }}> Unit: </td>
                            <td style={{ width: '50%', textAlign: 'right' }}>
                                {habit.unitName} <span style={{ color: '#707070' }}>({habit.unitMin} to {habit.unitMax})</span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}> Notes: </td>
                            <td style={{ width: '50%', textAlign: 'right' }}>
                                {habit.notes || <span style={{ fontStyle: 'italic', color: '#707070' }}>N/A</span>}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}> Number of Records: </td>
                            <td style={{ width: '50%', textAlign: 'right' }}>
                                {habit.records.length}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}> Earliest Record Date: </td>
                            <td style={{ width: '50%', textAlign: 'right' }}>
                                {firstDate.length > 0 ? firstDate : <span style={{ fontStyle: 'italic', color: '#707070' }}>N/A</span>}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left' }}> Latest Record Date: </td>
                            <td style={{ width: '50%', textAlign: 'right' }}>
                                {lastDate.length > 0 ? lastDate : <span style={{ fontStyle: 'italic', color: '#707070' }}>N/A</span>}
                            </td>
                        </tr>
                        {auth() !== undefined && auth() !== null && auth()?.id === user._id &&
                            <tr>
                                <td style={{ textAlign: 'left' }}> <label htmlFor="editModeSwitch">Edit Mode:</label> </td>
                                <td style={{ width: '50%', textAlign: 'right' }}>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            id="editModeSwitch"
                                            checked={editMode}
                                            onChange={handleToggle}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </td>
                            </tr>
                        }
                    </thead>
                </table>
            </div>
        </div>

    )
}

export default App