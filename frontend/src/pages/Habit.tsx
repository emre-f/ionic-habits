import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import "../styles/User.css"
import CONSTANTS from '../constants'
import AllUserHabits from '../components/user/AllUserHabits'
import CreateUserHabit from '../components/user/CreateUserHabit'

function App() {
    const [user, setUser] = useState<any>()
    const [habit, setHabit] = useState<any>()

    const { id, habitId } = useParams();
    const navigate = useNavigate();

    if (!id) {
        navigate('/');
        return null;
    }

    // Do this only once
    useEffect(() => {
        const fetchInfo = async () => {
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

            await fetch(`${CONSTANTS.API_URL}/users/${id}/habits/${habitId}`)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error("Error getting habit")
                }
            }).then(data => {
                setHabit(data);
            }).catch(error => {
                navigate('/') // Idk why error isn't caught here but it works :)
            });
        };

        fetchInfo();
    }, []);

    const renderInformation = () => {
        if (user && habit) {
            return (
                <div className="user-container">
                    <h1 className="title user-container-title"> {user.username}/{habit.name} </h1>
                </div>
            );
        } else {
            return null
        }
    };

    return (
        <>
            {renderInformation()}
        </>
    )
}

export default App