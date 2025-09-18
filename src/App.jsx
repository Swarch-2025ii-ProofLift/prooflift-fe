import './style.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Login } from './pages/Login.jsx'
import { SignUp } from './pages/SignUp.jsx'
import {Holi} from './pages/Holi.jsx'

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/holi' element={<Holi />} />
      </Routes>
    </Router>
  )
}

export default App