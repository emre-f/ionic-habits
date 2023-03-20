import { useState } from 'react'
import GoToUserButton from './GoToUserButton'

function ListAllUsers() {
    const [allUsers, setAllUsers] = useState<any[]>([])

    // function to fetch users and update allUsers state
    const fetchUsers = async () => {
        const response = await fetch('http://localhost:3500/users/');
        const data = await response.json();

        setAllUsers(data);
    };

    // render allUsers list if not empty
    const renderAllUsers = () => {
        if (allUsers.length > 0) {
            return (
                <div style={{ backgroundColor: 'cyan', padding: '10px 0', margin: '20px', maxWidth: '320px', borderRadius: '10px' }}>
                    {allUsers.map(user => (
                        <GoToUserButton user={user}/>
                    ))}
                </div>
            );
        } else {
            return null;
        }
    };

    return (
        <div className="card">
            <button onClick={fetchUsers} className="checkBackendButton" id='unknown'>
                See All Users
            </button>

            <div>
                {renderAllUsers()}
            </div>
        </div>
    )
}

export default ListAllUsers