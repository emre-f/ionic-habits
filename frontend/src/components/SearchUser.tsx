import { useState, useEffect, useContext } from 'react'
import Levenshtein from 'levenshtein';
import { useErrorMessage } from "./ErrorMessage";
import GoToUserButton from './GoToUserButton'

const SearchUser: React.FC = () => {
    const [currentUsers, setCurrentUsers] = useState<any[]>([])
    const [currentSearchInput, setCurrentSearchInput] = useState<string>('')
    const { handleMessage } = useErrorMessage();

    function searchNames(searchInput: string, userList: any[]) {
        const maxDistance = 2;
        searchInput = searchInput.toLowerCase();
        searchInput = searchInput.replace(/\s/g, ''); // Remove spaces
        const filteredNames = [];
        for (let i = 0; i < userList.length; i++) {
            let name = userList[i].username.toLowerCase();
            name = name.replace(/\s/g, ''); // Remove spaces

            let distance = new Levenshtein(searchInput, name).distance;
            if (distance <= maxDistance) {
                filteredNames.push(userList[i]);
            }
        }

        return filteredNames;
    }

    // function to fetch users and update allUsers state
    const findUser = async () => {

        // Get all users
        const response = await fetch('http://localhost:3500/users/');
        const allUserData = await response.json();

        // Search for user using searchNames method
        const filteredUsers = searchNames(currentSearchInput, allUserData);

        if (filteredUsers.length === 0) {
            handleMessage(`There are no users with the name "${currentSearchInput}"`);
        }

        // Update state
        setCurrentUsers(filteredUsers);
    };

    // render allUsers list if not empty
    const renderAllUsers = () => {
        if (currentUsers.length > 0) {
            return (
                <div style={{ backgroundColor: 'cyan', padding: '10px 0', margin: '20px', maxWidth: '320px', borderRadius: '10px' }}>
                    {currentUsers.map(user => (
                        <GoToUserButton key={user._id} user={user}/>
                    ))}
                </div>
            );
        } else {
            return null;
        }
    };

    // Make sure to disable search button if there is no input
    useEffect(() => {
        var searchButton = document.getElementById('searchUserButton')
        if (!searchButton) { return; }

        if (!currentSearchInput) {
            searchButton.setAttribute('disabled', 'true')
        } else {
            searchButton.removeAttribute('disabled')
        }
    }, [currentSearchInput])

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            <td>
                                <input
                                    style={{ fontSize: 20, border: 'none', borderRadius: '10px', width: '80%', padding: '6px' }}
                                    type="text"
                                    placeholder="username"
                                    onChange={(e: any) => setCurrentSearchInput(e.target.value)}
                                />
                            </td>
                            <td>
                                <button onClick={findUser} id='searchUserButton'>
                                    Search User
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                {renderAllUsers()}
            </div>
        </div>
    )
}

export default SearchUser