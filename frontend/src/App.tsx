import ionicHabitsLogo from '/logo.svg'
import Home from './pages/Home'
import About from './pages/About'
import User from './pages/User'
import Habit from './pages/Habit'
import SignIn from './pages/SignIn'
import Logout from './pages/Logout'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import { Route, Routes, Navigate } from 'react-router-dom'

const App: React.FC = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/login' element={<SignIn />} />
                <Route path='/logout' element={<Logout />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path="/user/:id" element={<User />} />
                <Route path="/user/:id/habit/:habitId" element={<Habit />} />

                <Route path="*" element={<Navigate to="/" />} /> {/* page-not-found route */}
            </Routes>
        </>
    )
}

export default App
