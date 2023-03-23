import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import "../styles/User.css"
import CONSTANTS from '../constants'
import AllUserHabits from '../components/user/AllUserHabits'
import CreateUserHabit from '../components/user/CreateUserHabit'

function App() {
    const [user, setUser] = useState<any>()

    const { id } = useParams();
    const navigate = useNavigate();

    if (!id) {
        navigate('/');
        return null;
    }

    // Do this only once
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`${CONSTANTS.API_URL}/users/${id}`);
            const data = await response.json();

            setUser(data)
        };

        fetchUser();
    }, []);

    const renderUserInformation = () => {
        if (user) {
            return (
                <div className="user-container">
                    <h1 className="title user-container-title"> {user.username} </h1>
                    <AllUserHabits user={user}/>
                    <CreateUserHabit user={user}/>
                </div>
            );
        } else {
            return null
        }
    };

    return (
        <>
            {renderUserInformation()}
        </>
    )
}

export default App