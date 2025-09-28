import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "/icono-white.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => setMenuOpen(!menuOpen)

  const handleLogout = () => {
    // console.log("Token eliminado de localStorage", localStorage.getItem("token"))
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  const handleNavigation = (path) => {
    navigate(path)
    setMenuOpen(false) // Cerrar menú móvil después de navegar
  }

  const menuItems = [
    { label: "Ejercicios", action: () => handleNavigation("/exercises") },
    { label: "Publicar", action: () => handleNavigation("/publicar") },
  ]

  return (
    <header
      className="sticky top-0 bg-background-secondary h-[10%] w-full flex items-center 
    justify-between p-4 border-b border-primary z-50"
    >
      <img 
        src={logo} 
        alt="Logo" 
        className="w-[20%] h-[90%] lg:w-[5%] cursor-pointer" 
        onClick={() => handleNavigation("/")}
      />

      {/* Botón menú solo en móviles */}
      <button className="text-2xl lg:hidden" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} className="text-white" />
      </button>

      {/* Menú lateral en móviles */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-background-secondary shadow-lg  
            transform transition-transform duration-300 text-white lg:hidden ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
      >
        <div className="p-4 font-extrabold text-lg">Menú</div>
        <ul className="flex flex-col p-2 gap-5 font-bold">
          {menuItems.map((item, index) => (
            <li key={index} onClick={item.action} className="options__header">
              {item.label}
            </li>
          ))}
          <p className='options__header' 
            onClick={handleLogout}>Cerrar Sesión</p>
        </ul>
      </aside>

      {/* Menú horizontal en desktop */}
      <ul className="hidden lg:flex lg:gap-20 text-white">
        {menuItems.map((item, index) => (
          <li
            key={index}
            onClick={item.action}
            className="li__header cursor-pointer hover:text-secondary"
          >
            {item.label}
          </li>
        ))}
      </ul>
      <p className='hidden lg:block text-white li__header cursor-pointer hover:text-secondary' 
      onClick={handleLogout}>Cerrar Sesión</p>
    </header>
  )
}

export { Header }

