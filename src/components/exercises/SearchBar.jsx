import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  // Búsqueda en tiempo real con debounce (solo si no se ha enviado con Enter)
  useEffect(() => {
    if (isSearchSubmitted) return; // No buscar en tiempo real si ya se envió con Enter
    
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        onSearch(query.trim());
      } else if (query.trim() === '') {
        onSearch('');
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch, isSearchSubmitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchTerm = query.trim();
    
    if (searchTerm.length >= 2) {
      onSearch(searchTerm);
      setQuery(''); // Limpiar el input
      setIsSearchSubmitted(true); // Marcar que se envió la búsqueda
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Si el usuario empieza a escribir de nuevo, volver al modo tiempo real
    if (isSearchSubmitted && value.length > 0) {
      setIsSearchSubmitted(false);
    }
    
    // Si borra todo manualmente, limpiar búsqueda solo si no está en modo "enviado"
    if (value.trim() === '' && !isSearchSubmitted) {
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
