import { useState } from 'react'
import { useErrorMessage } from "../components/ErrorMessage";
import { useNavigate } from 'react-router-dom'
import CONSTANTS from '../constants'

function App() {
    const { handleMessage } = useErrorMessage();
    const navigate = useNavigate();

    interface NewUser {
        username: string,
        password: string;
    }

    const [newUserInfo, setNewUserInfo] = useState<NewUser>()

    const createUser = async () => {
        // if new user info doesn't exist return
        if (!newUserInfo || (newUserInfo?.username === '' && newUserInfo?.password === '')) {
            handleMessage("Please enter a username and password");
            return;
        }
        if (newUserInfo?.username === '') {
            handleMessage("Please enter a username");
            return;
        }
        else if (newUserInfo?.password === '') {
            handleMessage("Please enter a password");
            return;
        }

        // Have limits for username and password
        if (newUserInfo?.username.length > 20 || newUserInfo?.username.length < 3) {
            handleMessage("Username must be between 3 and 20 characters");
            return;
        }
        if (newUserInfo?.password.length > 20 || newUserInfo?.password.length < 8) {
            handleMessage("Password must be between 8 and 20 characters");
            return;
        }

        // Username can't contain space or special characters, only alphabet and numbers
        const regex = /^[a-zA-Z0-9]+$/;
        if (!regex.test(newUserInfo?.username)) {
            handleMessage("Username can only contain letters and numbers");
            return;
        }

        // Check if username is already taken
        var usernameTaken = false;
        await fetch(`${CONSTANTS.API_URL}/users/`)
            .then(response => response.json())
            .then(data => {
                // Check if any user has the same username
                usernameTaken = data.find((user: any) => user.username === newUserInfo?.username);
            })
            .catch((error) => {
                handleMessage('Error: ' + error);
                return;
            }
        );

        if (usernameTaken) {
            handleMessage("Username is already taken");
            return;
        }

        await fetch(`${CONSTANTS.API_URL}/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUserInfo)
        }).catch((error) => {
            handleMessage('Error: ' + error);
            return;
        });

        // Get the new users ID
        var newId = "";
        await fetch(`${CONSTANTS.API_URL}/users/`)
            .then(response => response.json())
            .then(data => {
                // Find the new user's ID
                newId = data.find((user: any) => user.username === newUserInfo?.username)._id;
            })
            .catch((error) => {
                handleMessage('Error: ' + error);
                return;
            }
        );

        if (newId.length === 0) {
            window.location.reload();
            handleMessage("Error: Could not find newly created user");
        } else {
            // Go to users page
            navigate(`/user/${newId}`);
        }
    }

    return (
        <div className="card" style={{ textAlign: 'center' }}>
            <h1 className="title" style={{ marginBottom: '20px' }}> Welcome to Ionic Habits </h1>
            <div style={{ justifyContent: 'space-between', maxWidth: '360px', display: 'inline-block' }}>
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    style={{ fontSize: 20, border: 'none', borderRadius: '10px', width: '80%', padding: '6px', marginBottom: '10px' }}
                                    type="text"
                                    placeholder="username"
                                    onChange={
                                        (e: any) => setNewUserInfo(prevUserInfo => {
                                            const newUsername = e.target.value;
                                            const newPassword = prevUserInfo?.password ?? ''; // include existing password if it exists
                                            return { username: newUsername, password: newPassword };
                                        })
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input
                                    style={{ fontSize: 20, border: 'none', borderRadius: '10px', width: '80%', padding: '6px', marginBottom: '10px' }}
                                    type="password"
                                    placeholder="password"
                                    onChange={
                                        (e: any) => setNewUserInfo(prevUserInfo => {
                                            const newUsername = prevUserInfo?.username ?? ''; // include existing password if it exists
                                            const newPassword = e.target.value;
                                            return { username: newUsername, password: newPassword };
                                        })
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button onClick={createUser} id='createUserButton'>
                                    Create User
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default App