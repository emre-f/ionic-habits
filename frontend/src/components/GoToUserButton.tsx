import { useNavigate } from 'react-router-dom'

const App: React.FC<any> = ({ user }) => {
    const navigate = useNavigate();

    function goToUserProfile(userId:String) {
        navigate(`/user/${userId}`);
    }

    return (
        <button style={{ margin: '5px' }} key={user._id} onClick={() => goToUserProfile(user._id)}>
            {user.username}
        </button>
    );
}

export default App