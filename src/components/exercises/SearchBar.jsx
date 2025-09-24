import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchTerm = query.trim();
    
    if (searchTerm.length >= 2) {
      onSearch(searchTerm);
      setQuery(''); // Solo limpiar si es una búsqueda válida
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Búsqueda automática cuando se borra todo
    if (value.trim() === '') {
      onSearch('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-[90%] bg-tertiary rounded-2xl lg:w-[80%]">
      <FontAwesomeIcon 
        icon={faMagnifyingGlass} 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
      />
      <input 
        className='w-full h-12 pl-10 pr-8 text-secondary bg-transparent
             rounded-2xl border border-transparent 
             focus:outline-none focus:border-gray-500 placeholder-gray-400' 
        type="text" 
        placeholder="Buscar ejercicios"
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        minLength="2"
      />
    </form>
  )
}

export { SearchBar }
