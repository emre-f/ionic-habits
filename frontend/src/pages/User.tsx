import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import "../styles/User.css"

function App() {
    const [user, setUser] = useState<any>()

    const { id } = useParams();
    const navigate = useNavigate();

    if (!id) {
        navigate('/');
        return null;
    }

    // Describe habit object
    type Habit = {
        [key: string]: any;
    };

    // Do this only once
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`http://localhost:3500/users/${id}`);
            const data = await response.json();

            setUser(data)
        };

        fetchUser();
    }, []);

    // Drawing circles for habits
    function Circle(props: any) {
        const { percentage } = props;
        const color = `rgb(0, ${Math.round(255 * percentage)}, ${Math.round(255 * percentage)})`;
        var grayColor = 'rgba(0, 0, 0, 1)'
        
        const borderStyle = percentage !== -1
            ? 'none'
            : `1px solid ${grayColor}`;
        
        var lw = 3;
        const backgroundImage = percentage !== -1
            ? 'none'
            : `linear-gradient(45deg, transparent ${50 - lw}%, ${grayColor} ${50 - lw}%, ${grayColor} ${50 + lw}%, transparent ${50 + lw}%)`;

        return (
            <div style={{
                backgroundColor: percentage !== -1 ? color : 'transparent',
                backgroundImage: backgroundImage,
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                display: 'inline-block',
                marginRight: '5px',
                border: percentage !== -1 ? 'none' : borderStyle,
                boxSizing: 'border-box',
            }}></div>
        );
    }

    function CircleRow(props: any) {
        const { percentages } = props;
        const paddingCount = Math.max(0, 6 - percentages.length);

        for (let i = 0; i < paddingCount; i++) {
            percentages.unshift(-1);
        }

        const circles = [];
        for (let i = 0; i < 6; i++) {
            circles.push(<Circle key={i} percentage={percentages[i]} />);
        }

        return (
            <div>{circles}</div>
        );
    }

    function calculatePercentagesFromRecords(habit:any) {
        const percentages = [];
        for (let i = 0; i < habit.records.length; i++) {
            const record = habit.records[i];
            // make it a percentage between unitMin and unitMax
            var percentage = (record.value - habit.unitMin) / (habit.unitMax - habit.unitMin);
            percentages.push(percentage);
        }

        return percentages
    }

    const HabitsTableHeader = () => {
        if (user.habits.length === 0) {
            return (
                <p style={{ color: '#707070', fontStyle: 'italic' }}> No recorded habits </p>
            )
        } else {
            return (
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '50%', textAlign: 'left', color: '#707070' }}> Habits </th>
                            <th style={{ width: '50%', textAlign: 'right', color: '#707070' }}> Recent Records </th>
                        </tr>
                    </thead>
                </table>
            )
        }
    };

    const renderUserInformation = () => {
        if (user) {
            return (
                <div className="user-container">
                    <h1 className="title user-container-title"> {user.username} </h1>
                    <div className="user-info-container">
                        <h2 className="title" style={{ marginBottom: '20px' }}> Habits </h2>
                        <div>
                            <HabitsTableHeader />
                            
                            {user.habits.map((habit: Habit) => (
                                // make a table with habit name on the left, and 5 tiny circles next to each other
                                // each circle represents a day, and is either green or red depending on if the habit was completed that day
                                <table style={{ width: '100%' }} >
                                    <tbody>
                                        <tr>
                                            <td style={{ width: '50%', textAlign: 'left' }}>
                                                {habit.name}
                                            </td>
                                            <td style={{ width: '50%', textAlign: 'right' }}>
                                                <CircleRow percentages={calculatePercentagesFromRecords(habit)} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            ))}
                        </div>
                    </div>
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