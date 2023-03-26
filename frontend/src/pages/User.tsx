import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import "../styles/User.css"
import CONSTANTS from '../constants'
import AllUserHabits from '../components/user/AllUserHabits'
import CreateUserHabit from '../components/user/CreateUserHabit'
import DeleteItem from '../components/DeleteItem'

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
            await fetch(`${CONSTANTS.API_URL}/users/${id}`)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error("Error getting user")
                }
            }).then(data => {
                setUser(data);
            }).catch(error => {
                navigate('/') // Idk why error isn't caught here but it works :)
            });
        };

        fetchUser();
    }, []);

    const renderUserInformation = () => {
        if (user) {
            return (
                <div className="user-container">
                    <h1 className="title user-container-title"> {user.username} </h1>
                    <AllUserHabits user={user} />
                    <CreateUserHabit user={user} />
                    <DeleteItem 
                        name= "User"
                        link= {`${CONSTANTS.API_URL}/users/${id}`} 
                        redirectLink= {`/`}
                    />
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