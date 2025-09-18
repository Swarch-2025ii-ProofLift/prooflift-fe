import { Link } from 'react-router-dom'
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons"

import { TitleLogin } from '../components/login/TitleLogin.jsx'
import { FormInput } from '../components/login/FormInput.jsx'
import { InputCamp } from '../components/login/InputCamp.jsx'
import { login } from '../API/auth.js'
import logo from '/icono-white.png'

function Login () {

  const handleLogin = async (data) => {
    try {
      console.log("Datos del login:", data)
      const result = await login(data.email, data.password)
    } catch (error) {
      console.error("Error en el login:", error)
    }
  }

  return (
    <main className='main__login'>
      <div className='login'>
        <TitleLogin
          title='Bienvenido de nuevo'
          imgLink={logo}
          statement={
            <>
              Inicia sesión para continuar con <br /> tu entrenamiento
            </>
          }
        />
        <FormInput buttonText='Iniciar sesión' onSubmit={handleLogin}>
          <InputCamp
            icon={faUser}
            type='email'
            placeholder='Correo electrónico'
            data='email'
          />
          <InputCamp
            icon={faLock}
            type='password'
            placeholder='Contraseña'
            data='password'
          />
        </FormInput>
        <div className='login__p'>
          <p>¿No tienes una cuenta? 
            <Link className='login__link' to='/signup'>Regístrate</Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export { Login }
