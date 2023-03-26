import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useErrorMessage } from "../components/ErrorMessage";

const App: React.FC<any> = ({ name, link, redirectLink }) => {
    const { handleMessage } = useErrorMessage();
    const navigate = useNavigate();

    // First click turns state to true, second click deletes item
    const [deleteState, setDeleteState] = React.useState(false)

    // on state change of deletestate
    React.useEffect(() => {
        if (deleteState) {

            // turn button with deleteButton dark red
            const deleteButton = document.getElementById('deleteButton');
            if (deleteButton) {
                deleteButton.style.backgroundColor = 'darkred';
            }
        }
    }, [deleteState])

    const deleteItem = async () => {
        if (!deleteState) { setDeleteState(true); return; }

        await fetch(link, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (response.status === 200) {
                handleMessage(`Successfully deleted ${name}`)
                navigate(redirectLink);
            } else {
                throw new Error("Error deleting user")
            }
        }).catch(error => {
            handleMessage(`Error deleting ${name}`)
        });
    }

    return (
        <div className="user-info-container">
            <h2 className="title" style={{ marginBottom: '20px' }}> Delete {name} </h2>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={deleteItem} id='deleteButton'>
                    {deleteState? "Delete" : <span>Are you sure?</span>}
                </button>
            </div>
        </div>

    )
}

export default App