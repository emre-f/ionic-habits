import ionicHabitsLogo from '/logo.svg'
import '../styles/Home.css'
import CheckBackend from '../components/CheckBackend'
import ListAllUsers from '../components/ListAllUsers'
import SearchUser from '../components/SearchUser'

const Home: React.FC = () => {
    return (
        <div className="App">
            <div style={{ padding: '1em' }}>
                <img src={ionicHabitsLogo} className="logo" alt="Ionic Habits logo" />
                <h1 className='title'>Ionic Habits</h1>
            </div>
            
            <CheckBackend />

            <ListAllUsers />

            <SearchUser />

        </div>
    )
}

export default Home
