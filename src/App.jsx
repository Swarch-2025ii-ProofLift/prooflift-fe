import './style.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Login } from './pages/Login.jsx'
import { SignUp } from './pages/SignUp.jsx'
import { Exercises } from './pages/Exercises.jsx'

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/exercises' element={<Exercises />} />
      </Routes>
    </Router>
  )
}

export default App