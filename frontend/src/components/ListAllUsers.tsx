import { useState } from 'react'

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
                        <>
                            <button style={{ margin: '5px' }} key={user.id} onClick={() => goToUserProfile(user.id)}>
                                {user.username}
                            </button>
                        </>
                    ))}
                </div>
            );
        } else {
            return null;
        }
    };

    // function to handle click on user button and navigate to their profile
    const goToUserProfile = (userId: String) => {
        // navigate to user profile page
        // you can use React Router or any other routing library to implement this
        console.log(userId)
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