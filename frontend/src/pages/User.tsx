import { useParams, useNavigate } from 'react-router-dom'

function App() {
    const { id } = useParams();
    const navigate = useNavigate();

    if (!id) {
        navigate('/');
        return null;
    }

    return (
        <>
            <h1>User Page</h1>
            <p>For user ID {id}</p>
        </>
    )
}

export default App