
function Footer() {
  return (
    <footer className="flex flex-col items-start bottom-0 w-full h-[20%] 
    text-gray-400 border-t p-4 gap-5 lg:flex-row lg:justify-between lg:items-center lg:px-10">
        <ul className="flex flex-col gap-4 lg:flex-row">
            <li><a href="/about">Acerca de</a></li>
            <li><a href="/contact">Contacto</a></li>
            <li><a href="/privacy">Política de privacidad</a></li>
        </ul>
        <p>© 2025 ProofLift. Todos los derechos reservados.</p>
    </footer>
  )
}

export {Footer}
