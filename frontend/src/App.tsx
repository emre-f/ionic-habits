import ionicHabitsLogo from '/logo.svg'
import Home from './pages/Home'
import About from './pages/About'
import User from './pages/User'
import Header from './components/Header'
import { Route, Routes, Navigate } from 'react-router-dom'

const App: React.FC = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />

                <Route path="/user/:id" element={<User />} />
                <Route path="/user" element={<Navigate to="/" />} /> {/* Redirect to home page */}
            </Routes>
        </>
    )
}

export default App
