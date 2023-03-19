import ionicHabitsLogo from '/logo.svg'
import Home from './pages/Home'
import User from './pages/User'
import { Route, Routes, Link} from 'react-router-dom'

const App: React.FC = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>
            </nav>
                
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/user" element={<User />} />
            </Routes>
        </>
    )
}

export default App
