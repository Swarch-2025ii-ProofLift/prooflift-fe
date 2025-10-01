import './style.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Login } from './pages/Login.jsx'
import { SignUp } from './pages/SignUp.jsx'
import { Exercises } from './pages/Exercises.jsx'
import { InfoExercises } from './pages/InfoExercises.jsx'
import { Posts } from './pages/Posts.jsx'

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/exercises' element={<Exercises />} />
        <Route path='/exercises/:id' element={<InfoExercises />} />
        <Route path='/posts' element={<Posts />} />
      </Routes>
    </Router>
  )
}

export default App