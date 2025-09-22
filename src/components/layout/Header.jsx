import { useState } from "react"
import logo from "/icono-white.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/"
  }


  const menuItems = [
    { label: "Inicio"},
    { label: "Ejercicios"},
    { label: "Publicar" },
    { label: "Cerrar sesión", action: handleLogout },
  ]

  return (
    <header
      className="sticky top-0 bg-background-secondary h-[10%] w-full flex items-center 
    justify-between p-4 border-b border-primary z-50"
    >
      <img src={logo} alt="Logo" className="w-[20%] h-[90%] lg:w-[5%]" />

      {/* Botón menú solo en móviles */}
      <button className="text-2xl lg:hidden" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} className="text-white" />
      </button>

      {/* Menú lateral en móviles */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-primary 
            transform transition-transform duration-300 ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
      >
        <div className="p-4 font-extrabold text-lg">Menú</div>
        <ul className="flex flex-col p-2 gap-5 font-bold">
          {menuItems.map((item, index) => (
            <li key={index} onClick={item.action} className="cursor-pointer">
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Menú horizontal en desktop */}
      <ul className="hidden lg:flex lg:gap-20 text-white">
        {menuItems.slice(0, -1).map((item, index) => (
          <li
            key={index}
            onClick={item.action}
            className="li__header cursor-pointer"
          >
            {item.label}
          </li>
        ))}
      </ul>
      <p className='hidden lg:block text-white li__header' 
      onClick={handleLogout}>Cerrar Sesión</p>
    </header>
  )
}

export { Header }

