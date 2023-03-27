import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import "../styles/User.css"
import CONSTANTS from '../constants'
import AllHabitRecords from '../components/habit/AllHabitRecords'
import CreateHabitRecord from '../components/habit/CreateHabitRecord'
import DeleteHabitRecord from '../components/habit/DeleteHabitRecord'
import HabitSummary from '../components/habit/HabitSummary'
import DeleteItem from '../components/DeleteItem'

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
                    <h1 className="title user-container-title"> <span style={{color: '#707070'}}>{user.username}/</span>{habit.name} </h1>
                    <HabitSummary user={user} habit={habit} />
                    <AllHabitRecords user={user} habit={habit} />
                    <CreateHabitRecord user={user} habit={habit} />
                    <DeleteHabitRecord user={user} habit={habit} />
                    <DeleteItem 
                        name= "Habit"
                        link= {`${CONSTANTS.API_URL}/users/${id}/habits/${habitId}`} 
                        redirectLink= {`/user/${id}`}
                    />
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