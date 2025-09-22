import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

function SearchBar() {
  return (
    <div className="relative w-[90%] mx-auto bg-[#303030] rounded-2xl">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
        <input className='w-full h-12 pl-10 pr-8 text-secondary 
             rounded-2xl border border-transparent 
             focus:outline-none focus:border-gray-500' type="text" placeholder="Buscar ejercicios" />
    </div>
  )
}

export { SearchBar }
